"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const getWebsiteById = async (id: string) => {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }
        
        const website = await prisma.website.findFirst({where: { monitoredRoutes: { some: { id: id  }
        }}, include: {monitoredRoutes: true}});

        // console.log(websites);

        return {
            success: true,
            data: website,
            message: 'Data fetched successfully.'
        };
    } catch (error) {
        console.error('Error fetching website:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to get website data');
    }
}