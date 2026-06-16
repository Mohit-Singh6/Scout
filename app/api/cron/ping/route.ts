import { NextResponse, NextRequest } from "next/server";
import httpStatusCodes from "http-status-codes";

export async function GET(req: NextRequest) {
    const url: string = req.nextUrl.searchParams.get('url') as string;
    if (!url || typeof url !== "string" || url.trim() === "") {
        return NextResponse.json<any>({
                error: {
                    name: "BadrequestError",
                    code: httpStatusCodes.BAD_REQUEST,
                    status: "BAD_REQUEST",
                }
            })
    }

    try {
        const start = performance.now(); // Start the timer before making the request

        const response = await fetch(url, {
            signal: AbortSignal.timeout(5000), // 5 second timeout, note that this will return an error with name "TimeoutError" not "AbortError"
        });
        const end = performance.now(); // End the timer after receiving the response or when an error occurs
    
        const duration = end - start;
    
        return NextResponse.json({
            status: "OK",
            timeTaken: duration,
            code: response.status,
        });
    }
    catch (err: any) {
        if (err.name === "TimeoutError") {
            return NextResponse.json<any>({
                error: {
                    name: err.name,
                    message: err.message,
                    code: httpStatusCodes.GATEWAY_TIMEOUT,
                    status: "TIMEOUT_ERROR",
                }
            })
        }
        else {
            return NextResponse.json<any>({
                error: {
                    name: err.name,
                    message: err.message,
                    code: httpStatusCodes.INTERNAL_SERVER_ERROR,
                    status: err.status || "INTERNAL_SERVER_ERROR"
                }
            })
        }
    }
}