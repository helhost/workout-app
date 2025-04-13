import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUser = async (userData: {
    email: string;
    password: string;
    name: string;
    bio?: string;
    profilePicture?: string;
}) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user with all the related data in a transaction
    return prisma.$transaction(async (tx) => {
        // Create the user
        const user = await tx.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                bio: userData.bio,
                profilePicture: userData.profilePicture,
                settings: {
                    create: {} // Creates default UserSettings
                }
            }
        });

        // Create empty measurements container for the user
        await tx.userMeasurements.create({
            data: {
                userId: user.id
            }
        });

        // Return user without password
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            bio: user.bio,
            profilePicture: user.profilePicture
        };
    });
};

// In src/services/authService.ts
export const loginUser = async (email: string, password: string) => {
    // Find user by email with expanded profile information
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            password: true, // Include password to verify
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
                    defaultMeasurementUnit: true,
                }
            }
        }
    });

    // If no user found
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Get latest measurements
    const measurements = await prisma.userMeasurements.findUnique({
        where: { userId: user.id },
        include: {
            weights: {
                orderBy: { date: 'desc' },
                take: 1,
            },
            heights: {
                orderBy: { date: 'desc' },
                take: 1,
            },
            bodyFats: {
                orderBy: { date: 'desc' },
                take: 1,
            }
        }
    });

    // Format latest measurements
    const latestMeasurements = {
        weight: measurements?.weights[0] ? { value: measurements.weights[0].value, date: measurements.weights[0].date } : null,
        height: measurements?.heights[0] ? { value: measurements.heights[0].value, date: measurements.heights[0].date } : null,
        bodyFat: measurements?.bodyFats[0] ? { value: measurements.bodyFats[0].value, date: measurements.bodyFats[0].date } : null
    };

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return {
        ...userWithoutPassword,
        measurements: latestMeasurements,
        hasProfileImage: !!user.profileImage
    };
};