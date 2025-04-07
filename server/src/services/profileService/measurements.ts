// src/services/profileService/measurements.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ensure the user has a measurements record
export const ensureUserMeasurements = async (userId: string) => {
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