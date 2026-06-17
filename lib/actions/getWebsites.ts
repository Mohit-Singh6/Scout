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

        console.log(websites);

        return {
            success: true,
            data: websites,
            message: 'Data fetched successfully.'
        };
    } catch (error) {
        console.error('Error creating website:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to get websites data');
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