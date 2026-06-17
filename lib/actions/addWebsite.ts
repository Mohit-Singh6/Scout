"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// interface MonitoredRouteInput {
//     routePath: string;
//     routeType: string;
// }

// interface WebsiteInput {
//     name: string;
//     baseUrl: string;
//     hostingProvider: string;
//     monitoredRoutes: MonitoredRouteInput[];
// }

export const addWebsite = async (websiteData: any) => {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }
        websiteData.monitoredRoutes.forEach((routes: any) => {
            if ((routes.routeType != 'FRONTEND_PAGE') && (routes.routeType != 'BACKEND_HEALTH')) throw new Error('Sent Wrong Data: routeType can only be "FRONTEND_PAGE" or "BACKEND_HEALTH"');
        })
        

        const data = await prisma.website.create({
            data: {
                userId: session.user.id,
                name: websiteData.name,
                baseUrl: websiteData.baseUrl,
                hostingProvider: websiteData.hostingProvider,
                monitoredRoutes: {
                    create: websiteData.monitoredRoutes.map((route: any) => ({
                        routePath: route.routePath,
                        routeType: route.routeType,
                        // currentCondition defaults to OPERATIONAL automatically from schema
                    }))
                },
            },
            // Include the routes in the return payload so your UI state updates instantly
            include: {
                monitoredRoutes: true 
            }
        });

        return {
            success: true,
            data: data,
            message: 'Website created successfully'
        };
    } catch (error) {
        console.error('Error creating website:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create website');
    }
}



// model Website {
//   id              String           @id @default(cuid())
//   userId          String
//   user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
//   name            String
//   baseUrl         String           // e.g., "https://meetnow-backend.onrender.com"
//   hostingProvider String           // e.g., "RENDER", "VERCEL", "RAILWAY"
//   addedAt         DateTime         @default(now())

//   // The nested routes now point to a relational table
//   monitoredRoutes MonitoredRoute[] 
// }

// model MonitoredRoute {
//   id               String            @id @default(cuid())
//   websiteId        String
//   website          Website           @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  
//   routePath        String            // e.g., "/" or "/api/v1/health"
//   routeType        RouteType         // Enum validation split
//   currentCondition CurrentCondition  @default(OPERATIONAL) // Instant query cache lookups
//   updatedAt        DateTime          @updatedAt // Auto-updates on every latency log insertion for real-time status reflection

//   // Connects directly to our performance graph records
//   latencyLogs      LatencyLog[]      
// }