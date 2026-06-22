"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const DeleteWebsite = async (id: string) => {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            throw new Error('Unauthorized: User not found in session');
        }
        
        const websiteData = await prisma.website.delete({where: {id: id}});

        return {
            success: true,
            data: websiteData,
            message: 'Data fetched successfully.'
        };
    } catch (error) {
        console.error('Error fetching route:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to get route data');
    }
}
