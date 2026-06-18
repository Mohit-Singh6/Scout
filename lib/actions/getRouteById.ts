"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const getRouteById = async (id: string) => {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }
        
        const routeData = await prisma.monitoredRoute.findUnique({where: {id: id}, include: {website: true}});

        // console.log(websites);

        return {
            success: true,
            data: routeData,
            message: 'Data fetched successfully.'
        };
    } catch (error) {
        console.error('Error fetching route:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to get route data');
    }
}
