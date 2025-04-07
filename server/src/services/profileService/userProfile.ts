// src/services/profileService/userProfile.ts
import { PrismaClient } from '@prisma/client';
import { getLatestMeasurements } from './measurements';

const prisma = new PrismaClient();

// Get user profile with latest measurements
export const getUserProfileById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            profilePicture: true,
            createdAt: true,
            profileImage: {
                select: {
                    id: true,
                    filename: true,
                    mimeType: true,
                    size: true
                }
            },
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

    // Get the latest measurements
    const latestMeasurements = await getLatestMeasurements(userId);

    // Combine user data with latest measurements
    return {
        ...user,
        measurements: latestMeasurements,
        hasProfileImage: !!user.profileImage
    };
};

// Update user's name
export const updateUserName = async (userId: string, name: string) => {
    return prisma.user.update({
        where: { id: userId },
        data: { name },
        select: {
            id: true,
            name: true
        }
    });
};

// Update user's bio
export const updateUserBio = async (userId: string, bio: string) => {
    return prisma.user.update({
        where: { id: userId },
        data: { bio },
        select: {
            id: true,
            bio: true
        }
    });
};

// Update user's profile picture
export const updateUserProfilePicture = async (userId: string, profilePicture: string) => {
    return prisma.user.update({
        where: { id: userId },
        data: { profilePicture },
        select: {
            id: true,
            profilePicture: true
        }
    });
};