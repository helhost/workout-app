import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


/**
 * Creates a new user with the provided data
 * @param userData The user's data
 * @returns The created user's ID if successful
 * @throws Error if user already exists or if there is an issue creating the user
 */
export const register = async (name: string, email: string, password: string): Promise<{ id: string }> => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with all the related data in a transaction
    return prisma.$transaction(async (tx) => {
        // Create the user
        const user = await tx.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
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

        // Return only the fields specified in UserRegistrationResponse
        return {
            id: user.id,
        };
    });
};

/**
 * Authenticates a user with email and password
 * @param email The user's email
 * @param password The user's plaintext password
 * @returns The user's ID if authentication is successful
 * @throws Error if credentials are invalid
 */
export const login = async (email: string, password: string): Promise<{ id: string }> => {
    // Find user by email with minimal data for authentication
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            password: true,
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

    // Only return the user ID
    return { id: user.id };
};