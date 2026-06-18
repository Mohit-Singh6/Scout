import { NextResponse, NextRequest } from "next/server";
import httpStatusCodes from "http-status-codes";
import { getAllRoutes } from "@/lib/actions/getAllRoutes";
import { prisma } from "@/lib/prisma";

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

        await prisma.latencyLog.create({
            data: {
                routeId: route.id,
                statusCode: response.status,
                latencyMs: duration,
                aiSummary: response.statusText || "Checked successfully",
                exceptionMessage: ""
            }
        });

        await prisma.monitoredRoute.update({
            where: { id: route.id },
            data: {
                currentCondition: response.status === 200 ? 'OPERATIONAL' : 'DEGRADED',
                updatedAt: new Date()
            }
        });

        return { id: route.id, status: "COMPLETED", code: response.status };
    }
    catch (err: any) {
        const end = performance.now();
        const duration = Math.round(end - start);

        if (err.name === "TimeoutError") {
            await prisma.latencyLog.create({
                data: {
                    routeId: route.id,
                    statusCode: httpStatusCodes.GATEWAY_TIMEOUT,
                    latencyMs: duration,
                    aiSummary: "Took too long to respond.",
                    exceptionMessage: "Took too long to respond."
                }
            });

            await prisma.monitoredRoute.update({
                where: { id: route.id },
                data: { currentCondition: 'TIMEOUT', updatedAt: new Date() }
            });
        } else {
            await prisma.latencyLog.create({
                data: {
                    routeId: route.id,
                    statusCode: 500, 
                    latencyMs: duration,
                    aiSummary: "An error occurred",
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
