"use server";

import { auth } from '@/auth';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { differenceInDays, eachDayOfInterval, interval, startOfDay } from 'date-fns';

export const getPercentageUptime = async (id: string, startDate: Date, endDate: Date) => {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }

        const createdAtQuery: Prisma.LatencyLogWhereInput["createdAt"] = {};
        if (startDate) createdAtQuery.gte = startDate;
        if (endDate) createdAtQuery.lte = endDate;

        const logs = await prisma.latencyLog.findMany({ where: { routeId: id, createdAt: createdAtQuery }, orderBy: { createdAt: "asc" }, include: { monitoredRoute: true } });

        console.log("uptimeData:", logs);

        const formattedlogs = logs.map((log) => (
            {
                time: new Date(log.createdAt).toLocaleString([], {
                    timeZone: "Asia/Kolkata",
                    hour12: true,
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                status: log.statusCode
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
                timeZone: "Asia/Kolkata",
                hour12: true,
                month: 'short',
                day: '2-digit'
            });

            if (!groups[day]) groups[day] = [];
            groups[day].push((log.statusCode >= 200 && log.statusCode < 400) ? 1 : 0);
        });

        // Map the buckets into a unified daily average array format for Recharts
        const dailyAverages = Object.keys(groups).map(day => {
            const sum = groups[day].reduce((a, b) => a + b, 0);
            const percentage = Math.round(sum / groups[day].length * 100);
            console.log("Sum, len, perc: ", sum, groups[day].length, percentage);

            return {
                time: day, // Becomes "Jun 19", "Jun 20", etc.
                uptimePerc: percentage
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