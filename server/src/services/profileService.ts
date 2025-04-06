import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get user profile with latest measurements
export const getUserProfileById = async (userId: string) => {
    // Get the user with their basic profile info
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

// Add or update profile image
export const saveProfileImage = async (
    userId: string,
    imageData: {
        filename: string;
        data: Buffer;
        mimeType: string;
        size: number;
    }
) => {
    // Check if user already has a profile image
    const existingImage = await prisma.profileImage.findUnique({
        where: { userId }
    });

    if (existingImage) {
        // Update existing image
        return prisma.profileImage.update({
            where: { userId },
            data: {
                filename: imageData.filename,
                data: imageData.data,
                mimeType: imageData.mimeType,
                size: imageData.size,
                updatedAt: new Date()
            },
            select: {
                id: true,
                filename: true,
                mimeType: true,
                size: true
            }
        });
    } else {
        // Create new image
        return prisma.profileImage.create({
            data: {
                userId,
                filename: imageData.filename,
                data: imageData.data,
                mimeType: imageData.mimeType,
                size: imageData.size
            },
            select: {
                id: true,
                filename: true,
                mimeType: true,
                size: true
            }
        });
    }
};

// Get profile image data by user ID
export const getProfileImageData = async (userId: string) => {
    const profileImage = await prisma.profileImage.findUnique({
        where: { userId },
        select: {
            data: true,
            mimeType: true,
            filename: true
        }
    });

    if (!profileImage) {
        throw new Error('Profile image not found');
    }

    return profileImage;
};

// Delete profile image
export const deleteProfileImage = async (userId: string) => {
    return prisma.profileImage.delete({
        where: { userId }
    });
};

// Ensure the user has a measurements record
const ensureUserMeasurements = async (userId: string) => {
    // Try to get existing measurements
    let measurements = await prisma.userMeasurements.findUnique({
        where: { userId }
    });

    // If no measurements record exists, create one
    if (!measurements) {
        measurements = await prisma.userMeasurements.create({
            data: { userId }
        });
    }

    return measurements;
};

// Get latest measurements for all types
export const getLatestMeasurements = async (userId: string) => {
    // First ensure the user has a measurements record
    const measurements = await ensureUserMeasurements(userId);

    // Get the latest weight measurement
    const latestWeight = await prisma.weightMeasurement.findFirst({
        where: { userMeasurementsId: measurements.id },
        orderBy: { date: 'desc' }
    });

    // Get the latest height measurement
    const latestHeight = await prisma.heightMeasurement.findFirst({
        where: { userMeasurementsId: measurements.id },
        orderBy: { date: 'desc' }
    });

    // Get the latest body fat measurement
    const latestBodyFat = await prisma.bodyFatMeasurement.findFirst({
        where: { userMeasurementsId: measurements.id },
        orderBy: { date: 'desc' }
    });

    return {
        weight: latestWeight ? { value: latestWeight.value, date: latestWeight.date } : null,
        height: latestHeight ? { value: latestHeight.value, date: latestHeight.date } : null,
        bodyFat: latestBodyFat ? { value: latestBodyFat.value, date: latestBodyFat.date } : null
    };
};

// Get measurement history for a specific measurement type
export const getMeasurementHistory = async (userId: string, type: 'weight' | 'height' | 'bodyFat', limit = 10) => {
    // Ensure user has measurements
    const measurements = await ensureUserMeasurements(userId);

    switch (type) {
        case 'weight':
            return prisma.weightMeasurement.findMany({
                where: { userMeasurementsId: measurements.id },
                orderBy: { date: 'desc' },
                take: limit,
                select: {
                    id: true,
                    value: true,
                    date: true
                }
            });
        case 'height':
            return prisma.heightMeasurement.findMany({
                where: { userMeasurementsId: measurements.id },
                orderBy: { date: 'desc' },
                take: limit,
                select: {
                    id: true,
                    value: true,
                    date: true
                }
            });
        case 'bodyFat':
            return prisma.bodyFatMeasurement.findMany({
                where: { userMeasurementsId: measurements.id },
                orderBy: { date: 'desc' },
                take: limit,
                select: {
                    id: true,
                    value: true,
                    date: true
                }
            });
        default:
            throw new Error('Invalid measurement type');
    }
};

// Add a new weight measurement
export const addWeightMeasurement = async (userId: string, value: number, date?: Date) => {
    // Ensure user has measurements
    const measurements = await ensureUserMeasurements(userId);

    return prisma.weightMeasurement.create({
        data: {
            userMeasurementsId: measurements.id,
            value,
            date: date || new Date()
        }
    });
};

// Add a new height measurement
export const addHeightMeasurement = async (userId: string, value: number, date?: Date) => {
    // Ensure user has measurements
    const measurements = await ensureUserMeasurements(userId);

    return prisma.heightMeasurement.create({
        data: {
            userMeasurementsId: measurements.id,
            value,
            date: date || new Date()
        }
    });
};

// Add a new body fat measurement
export const addBodyFatMeasurement = async (userId: string, value: number, date?: Date) => {
    // Ensure user has measurements
    const measurements = await ensureUserMeasurements(userId);

    return prisma.bodyFatMeasurement.create({
        data: {
            userMeasurementsId: measurements.id,
            value,
            date: date || new Date()
        }
    });
};