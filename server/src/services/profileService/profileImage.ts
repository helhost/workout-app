// src/services/profileService/profileImage.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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