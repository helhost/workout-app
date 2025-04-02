import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserProfileById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            occupation: true,
            birthday: true,
            website: true,
            bio: true,
            createdAt: true,
            settings: {
                select: {
                    language: true,
                    darkMode: true,
                    highContrast: true,
                    emailNotifications: true,
                    pushNotifications: true,
                    notificationSound: true
                }
            }
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};