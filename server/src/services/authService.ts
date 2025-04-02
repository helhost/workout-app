import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUser = async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
    occupation?: string;
    birthday?: Date;
    website?: string;
    bio?: string;
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

    // Create user with optional fields
    return prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
            settings: {
                create: {} // Creates default UserSettings
            }
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            address: true,
            occupation: true,
            birthday: true,
            website: true,
            bio: true
        }
    });
};