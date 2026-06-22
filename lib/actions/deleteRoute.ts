"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { useRouter } from 'next/navigation';

export const DeleteRoute = async (id: string) => {
    try {
        const router = useRouter();
        const session = await auth();
        
        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }
        
        const routeData = await prisma.monitoredRoute.delete({where: {id: id}, include: {website: true}});

        // console.log(websites);
        const newRouteRedirect = await prisma.monitoredRoute.findFirst({
            where: {
                websiteId: routeData.websiteId
            }
        });

        if (newRouteRedirect) {
            router.push(`/sites/${newRouteRedirect.id}`);
        }
        else {
            router.push(`/sites`);
        }

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
