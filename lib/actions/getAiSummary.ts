"use server";

import { auth } from '@/auth';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { differenceInDays } from 'date-fns';

export const getAiSummary = async (id: string) => {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }

        const logs = await prisma.latencyLog.findFirst({ where: { routeId: id }, orderBy: { createdAt: "desc" }});

        console.log("logs:", logs);

        return {
            success: true,
            data: logs?.aiSummary,
            message: 'Data fetched successfully.'
        };
    } catch (error) {
        console.error('Error fetching ai summary:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to ai summary.');
    }
}