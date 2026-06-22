import { NextResponse, NextRequest } from "next/server";
import httpStatusCodes from "http-status-codes";
import { getAllRoutes } from "@/lib/actions/getAllRoutes";
import { prisma } from "@/lib/prisma";
import { analyzeErrorLog } from "@/lib/actions/analyzeErrorLog";
import { subDays } from "date-fns";

interface MonitoredRoute {
    id: string;
    routePath: string;
    routeType: string;
    currentCondition: string;
    website: Website;
}

interface Website {
    id: string;
    name: string;
    baseUrl: string;
    hostingProvider: string;
    addedAt: Date;
}


// Helper function for extracting the error message
function extractErrorMessage(err: any): string {
    if (!err) return "Unknown completely empty error context.";

    // 1. If it's a flat string thrown directly: throw "Server died"
    if (typeof err === "string") return err;

    // 2. Check for nested Axios/Fetch style library responses
    if (err.response?.data?.message) return String(err.response.data.message);
    if (err.response?.data) return typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);

    // 3. Check modern JS nested causes: err.cause.message
    if (err.cause?.message) return String(err.cause.message);
    if (err.cause) return typeof err.cause === 'string' ? err.cause : JSON.stringify(err.cause);

    // 4. Standard Error object property tracking
    if (err.message) return String(err.message);

    // 5. Fallback: If it's an unexpected object layout, stringify it safely
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}


// Same normal function, does the same job that needs to be done, nothing special
async function pingSingleRoute(route: MonitoredRoute) {
    const url = route.website.baseUrl + route.routePath;
    const start = performance.now();  // Start the timer before making the request
    
    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(5000),   // 5 second timeout, note that this will return an error with name "TimeoutError" not "AbortError"
            cache: "no-store"  // just to be safe, include this too, waise to by default yahi hota hai, lekin agar upar 'use cache' kar diya to problem ho jaayegi, isliye to be safe.
        });
        const end = performance.now();  // End the timer after receiving the response or when an error occurs
        const duration = Math.round(end - start);

        const status = response.status;

        // Determine the condition and the AI summary based on the actual status code
        let condition: 'OPERATIONAL' | 'DEGRADED' | 'DOWN' = 'OPERATIONAL';
        let aiSummaryText = "";

        if (status >= 200 && status < 300) {
            condition = 'OPERATIONAL';
            aiSummaryText = duration <= 800 
                ? "All systems nominal. Responding efficiently with optimal latency." 
                : "The route responded successfully but is experiencing abnormal latency delays.";
        } else if (status >= 400 && status < 500) {
            condition = 'DEGRADED';
            // Trigger the AI to explain the client-side error code (e.g., 404 or 401)
            const aiRes = await analyzeErrorLog(status, `Route returned client failure status code text wrapper configuration.`);
            aiSummaryText = aiRes.analysis || `Client error response encountered (${status}).`;
        } else {
            condition = 'DOWN';
            // Trigger the AI for server-side failures (5xx codes)
            const aiRes = await analyzeErrorLog(status, `Server returned an internal critical infrastructure error response stack.`);
            aiSummaryText = aiRes.analysis || `Critical server error response encountered (${status}).`;
        }

        await prisma.latencyLog.create({
            data: {
                routeId: route.id,
                statusCode: status,
                latencyMs: duration,
                aiSummary: aiSummaryText,
                exceptionMessage: response.statusText || httpStatusCodes.getStatusText(status)
            }
        });

        await prisma.monitoredRoute.update({
            where: { id: route.id },
            data: {
                currentCondition: condition,
                updatedAt: new Date()
            }
        });

        return { id: route.id, status: "COMPLETED", code: status };
    }
    catch (err: any) {
        const end = performance.now();
        const duration = Math.round(end - start);

        if (err.name === "TimeoutError") {
            const payloadText = `Fetch request timed out after exceeding the designated 5000ms threshold window while connecting to remote destination host source origin line.`;

            const aiResponse = (await analyzeErrorLog(httpStatusCodes.GATEWAY_TIMEOUT, payloadText)).analysis;

            await prisma.latencyLog.create({
                data: {
                    routeId: route.id,
                    statusCode: httpStatusCodes.GATEWAY_TIMEOUT,
                    latencyMs: duration,
                    aiSummary: aiResponse || "Gateway timeout threshold exceeded.",
                    exceptionMessage: "Took too long to respond."
                }
            });

            await prisma.monitoredRoute.update({
                where: { id: route.id },
                data: { currentCondition: 'TIMEOUT', updatedAt: new Date() }
            });
        } else {

            const errText = extractErrorMessage(err);

            const payloadText = `Error Name: ${err.name || "UnknownError"}\nMessage: ${errText || "No error message provided."}\nStack: ${err.stack || "No trace found."}`;
            const aiResponse = (await analyzeErrorLog(500, payloadText)).analysis;

            await prisma.latencyLog.create({
                data: {
                    routeId: route.id,
                    statusCode: 500, 
                    latencyMs: duration,
                    aiSummary: aiResponse || "An internal network connection fault occurred.",
                    exceptionMessage: err.message || "Internal server network error."
                }
            });

            await prisma.monitoredRoute.update({
                where: { id: route.id },
                data: { currentCondition: 'DOWN', updatedAt: new Date() }
            });
        }
        
        // Throwing the error inside this handler ensures Promise.allSettled records it as "rejected"
        throw err; 
    }
}

export async function GET() {
    try {
        await prisma.latencyLog.deleteMany({
            where: {
                createdAt: {lt: subDays(new Date(), 30)}
            }
        })

        const routes = (await getAllRoutes()).data as MonitoredRoute[];
        
        // Generate an array of active, un-awaited pending Promises
        const pingPromises = routes.map((route) => pingSingleRoute(route)); // When you call an async function in JavaScript, it automatically and instantly returns a Promise.
        // Because you didn't put the await keyword in front of pingSingleRoute(route) inside your .map() loop, JavaScript doesn't pause to let the function finish. It fires the function off into the background and instantly drops a Promise { <pending> } placeholder into your array.
        
        // Fire all requests concurrently and wait for the entire wave to settle
        const batchResults = await Promise.allSettled(pingPromises); // for more details check promiseAllSettled.md
        // You use .then() and .catch() when you are writing classic Promise chain syntax, whereas in your /api/cron/ping route, you are using the modern async/await syntax.
        // The .catch of .allSettled only fires when the Promise.allSettled itself rejects not the things inside it => Which almost never happens
        // Because we wrote clean internal try/catch blocks inside pingSingleRoute to handle individual website connection drops, our await Promise.allSettled() line is completely bulletproof, making an extra chain-link .catch() completely unnecessary!

        
        console.log("Batch performance report execution results:", batchResults);
    
        return NextResponse.json({
            name: "OK",
            message: "Logged the status of all websites concurrently.",
            summary: batchResults.map((r, index) => ({
                routeId: routes[index].id,
                websiteName: routes[index].website.name,
                routePath: routes[index].routePath,
                outcome: r.status // Will explicitly show "fulfilled" or "rejected"
            }))
        }, { status: 200 });    
    }
    catch(err: any) {
        console.log("Fatal processing failure error: ", err);
        return NextResponse.json({
            error: err.message || "Fatal error context"
        }, { status: 500 });
    }
}
