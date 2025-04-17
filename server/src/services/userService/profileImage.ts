import { PrismaClient } from '@prisma/client';
import { User } from '@shared';

const prisma = new PrismaClient();

/**
 * Saves or updates a user's profile image
 * @param userId The user's unique identifier
 * @param imageData Object containing image data and metadata
 * @returns Profile image metadata (excluding binary data)
 */
export const saveProfileImage = async (
    userId: string,
    imageData: User.ProfileImage
): Promise<Omit<User.ProfileImage, 'data'>> => {
    // Check if user already has a profile image
    const existingImage = await prisma.profileImage.findUnique({
        where: { userId }
    });

    if (existingImage) {
        // Update existing profile image
        return await prisma.profileImage.update({
            where: { userId },
            data: {
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

    } else {
        // Create new profile image
        return await prisma.profileImage.create({
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

/**
 * Gets a user's profile image (including binary data)
 * @param userId The user's unique identifier
 * @returns Complete profile image including binary data
 * @throws Error if profile image is not found
 */
export const getProfileImage = async (userId: string): Promise<User.ProfileImage> => {
    const profileImage = await prisma.profileImage.findUnique({
        where: { userId },
        select: {
            id: true,
            data: true,
            mimeType: true,
            filename: true,
            size: true
        }
    });

    if (!profileImage) {
        throw new Error('Profile image not found');
    }

    return profileImage;
};

/**
 * Gets profile image metadata (without binary data)
 * @param userId The user's unique identifier
 * @returns Profile image metadata
 * @throws Error if profile image is not found
 */
export const getProfileImageMetadata = async (userId: string): Promise<Omit<User.ProfileImage, 'data'>> => {
    const profileImage = await prisma.profileImage.findUnique({
        where: { userId },
        select: {
            id: true,
            filename: true,
            mimeType: true,
            size: true
        }
    });

    if (!profileImage) {
        throw new Error('Profile image not found');
    }

    return profileImage;
};

/**
 * Deletes a user's profile image
 * @param userId The user's unique identifier
 * @throws Error if profile image is not found or deletion fails
 */
export const deleteProfileImage = async (userId: string): Promise<void> => {
    await prisma.profileImage.delete({
        where: { userId }
    });
};