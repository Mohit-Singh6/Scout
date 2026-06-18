"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const getWebsites = async () => {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }
        
        const websites = await prisma.website.findMany({where: {userId: session.user.id}, include: {monitoredRoutes: true}});

        // console.log(websites);

        return {
            success: true,
            data: websites,
            message: 'Data fetched successfully.'
        };
    } catch (error) {
        console.error('Error fetching website:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to get websites data');
    }
}
