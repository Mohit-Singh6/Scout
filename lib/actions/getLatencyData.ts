"use server";

import { auth } from '@/auth';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { differenceInDays, eachDayOfInterval, interval, startOfDay } from 'date-fns';

export const getLatencyData = async (id: string, startDate: Date, endDate: Date) => {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }

        const createdAtQuery: Prisma.LatencyLogWhereInput["createdAt"] = {};
        if (startDate) createdAtQuery.gte = startDate;
        if (endDate) createdAtQuery.lte = endDate;

        const logs = await prisma.latencyLog.findMany({ where: { routeId: id, createdAt: createdAtQuery }, orderBy: { createdAt: "asc" }, include: { monitoredRoute: true } });

        console.log("logs:", logs);

        const formattedlogs = logs.map((log) => (
            {
                time: new Date(log.createdAt).toLocaleString([], {
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                latency: log.latencyMs
            }
        ));

        const isGreaterThanADay = differenceInDays(endDate, startDate) > 1;
        if (!isGreaterThanADay) return {
            success: true,
            data: formattedlogs,
            message: 'Data fetched successfully.'
        } 

        // Group raw logs into calendar day buckets (e.g., "Jun 19")
        const groups: Record<string, number[]> = {};

        logs.forEach(log => {
            const day = new Date(log.createdAt).toLocaleDateString([], {
                month: 'short',
                day: '2-digit'
            });

            if (!groups[day]) groups[day] = [];
            groups[day].push(log.latencyMs);
        });

        // Map the buckets into a unified daily average array format for Recharts
        const dailyAverages = Object.keys(groups).map(day => {
            const sum = groups[day].reduce((a, b) => a + b, 0);
            const avg = Math.round(sum / groups[day].length);

            return {
                time: day, // Becomes "Jun 19", "Jun 20", etc.
                latency: avg
            };
        });

        return {
            success: true,
            data: dailyAverages,
            message: 'Data fetched successfully.'
        };
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to get logs.');
    }
}