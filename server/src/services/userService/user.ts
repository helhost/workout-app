import { PrismaClient } from '@prisma/client';
import { getLatestMeasurements } from './measurements';
import { User } from '@shared'

const prisma = new PrismaClient();

/**
 * Retrieves a user by their ID with latest measurements
 * @param id The user's unique identifier
 * @returns Complete user profile including latest measurements
 * @throws Error if user is not found
 */
export const getUserById = async (id: string): Promise<User.UserFull> => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
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
                    defaultMeasurementUnit: true,
                }
            }
        }
    });

    if (!user) {
        throw new Error('User not found');
    }
    // Get the latest measurements
    const latestMeasurements = await getLatestMeasurements(id);

    // Combine user data with latest measurements
    return { ...user, measurements: latestMeasurements };
};



/**
 * Updates a user's name
 * @param userId The user's unique identifier
 * @param name The new name to set
 * @returns Object containing the user's ID and updated name
 * @throws Error if user is not found or update fails
 */
export const updateUsername = async (userId: string, name: string): Promise<{ name: string, id: string }> => {
    return prisma.user.update({
        where: { id: userId },
        data: { name },
        select: {
            id: true,
            name: true
        }
    });
};



/**
 * Updates a user's bio information
 * @param userId The user's unique identifier
 * @param bio The new bio text to set
 * @returns Object containing the user's ID and updated bio
 * @throws Error if user is not found or update fails
 */
export const updateBio = async (userId: string, bio: string): Promise<{ id: string, bio: string }> => {
    return prisma.user.update({
        where: { id: userId },
        data: { bio },
        select: {
            id: true,
            bio: true
        }
    });
};


/**
 * Updates or creates user settings
 * @param userId The user's unique identifier
 * @param settingsData Object containing settings to update
 * @returns Updated user settings
 * @throws Error if user is not found or settings update fails
 */
export const updateSettings = async (userId: string, settingsData: User.Settings): Promise<User.Settings> => {
    // Validate input data to ensure we only update existing fields
    const validUpdates: any = {};

    if (typeof settingsData.darkMode === 'boolean') {
        validUpdates.darkMode = settingsData.darkMode;
    }

    if (typeof settingsData.language === 'string') {
        validUpdates.language = settingsData.language;
    }

    if (typeof settingsData.defaultMeasurementUnit === 'string') {
        validUpdates.defaultMeasurementUnit = settingsData.defaultMeasurementUnit;
    }

    // Check if settings exist for the user
    const existingSettings = await prisma.userSettings.findUnique({
        where: { userId }
    });

    if (existingSettings) {
        // Update existing settings
        return prisma.userSettings.update({
            where: { userId },
            data: validUpdates,
            select: {
                darkMode: true,
                language: true,
                defaultMeasurementUnit: true
            }
        });
    } else {
        // Create new settings with defaults and the provided updates
        return prisma.userSettings.create({
            data: {
                userId,
                ...validUpdates
            },
            select: {
                darkMode: true,
                language: true,
                defaultMeasurementUnit: true
            }
        });
    }
};