import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams;
}