"use server";

// import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';



export const getAllRoutes = async () => {
    try {
        // const session = await auth();
        
        // if (!session?.user?.id) {
        //     throw new Error('Unauthorized: User not found in session');
        // }
        
        const routes = await prisma.monitoredRoute.findMany({ include: {website: true} });

        // console.log(routes);

        return {
            success: true,
            data: routes,
            message: 'Data fetched successfully.'
        };
    } catch (error) {
        console.error('Error fetching routes:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to get routes data');
    }
}
