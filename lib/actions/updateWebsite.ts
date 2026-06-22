"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const updateWebsite = async (websiteId: string, websiteData: any) => {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }

        // Validate route types
        websiteData.monitoredRoutes.forEach((routes: any) => {
            if ((routes.routeType != 'FRONTEND_PAGE') && (routes.routeType != 'BACKEND_HEALTH')) {
                throw new Error('Sent Wrong Data: routeType can only be "FRONTEND_PAGE" or "BACKEND_HEALTH"');
            }
        });

        // Update website info
        const updatedWebsite = await prisma.website.update({
            where: { id: websiteId },
            data: {
                name: websiteData.name,
                baseUrl: websiteData.baseUrl,
                hostingProvider: websiteData.hostingProvider,
            },
            include: {
                monitoredRoutes: true
            }
        });

        // Handle routes: delete old ones and create new ones
        await prisma.monitoredRoute.deleteMany({
            where: { websiteId: websiteId }
        });

        // Create new routes
        const newRoutes = await Promise.all(
            websiteData.monitoredRoutes.map((route: any) =>
                prisma.monitoredRoute.create({
                    data: {
                        websiteId: websiteId,
                        routePath: route.routePath,
                        routeType: route.routeType,
                    }
                })
            )
        );

        return {
            data: {
                ...updatedWebsite,
                monitoredRoutes: newRoutes
            },
            error: null
        };
    } catch (error: any) {
        console.error('Error updating website:', error);
        return {
            data: null,
            error: {
                message: error.message || 'Failed to update website'
            }
        };
    }
};
