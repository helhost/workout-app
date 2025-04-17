import { PrismaClient } from '@prisma/client';
import { User } from '@shared';

const prisma = new PrismaClient();

/**
 * Ensures that a user has a measurements record in the database
 * @param userId The user's unique identifier
 * @returns Object containing the measurements record ID
 * @throws Error if the operation fails
 */
export const ensureUserMeasurements = async (userId: string): Promise<{ id: string }> => {
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

    return { id: measurements.id };
};

/**
 * Retrieves the latest measurements for a user across all measurement types
 * @param userId The user's unique identifier
 * @returns Object containing the latest weight, height, and body fat measurements
 * @throws Error if the operation fails
 */
export const getLatestMeasurements = async (userId: string): Promise<User.SimpleMeasurements> => {
    // First ensure the user has a measurements record
    const measurements = await ensureUserMeasurements(userId);

    // Get the latest weight measurement
    const latestWeight = await prisma.weightMeasurement.findFirst({
        where: { userMeasurementsId: measurements.id },
        orderBy: { createdAt: 'desc' }
    });

    // Get the latest height measurement
    const latestHeight = await prisma.heightMeasurement.findFirst({
        where: { userMeasurementsId: measurements.id },
        orderBy: { createdAt: 'desc' }
    });

    // Get the latest body fat measurement
    const latestBodyFat = await prisma.bodyFatMeasurement.findFirst({
        where: { userMeasurementsId: measurements.id },
        orderBy: { createdAt: 'desc' }
    });

    return {
        weight: latestWeight ? { value: latestWeight.value, createdAt: latestWeight.createdAt } : null,
        height: latestHeight ? { value: latestHeight.value, createdAt: latestHeight.createdAt } : null,
        bodyFat: latestBodyFat ? { value: latestBodyFat.value, createdAt: latestBodyFat.createdAt } : null
    };
};

/**
 * Retrieves the measurement history for a user
 * @param userId The user's unique identifier
 * @param limit Maximum number of measurements to return per type (default: 10)
 * @returns Object containing arrays of weight, height, and body fat measurements
 * @throws Error if the operation fails
 */
export const getMeasurementHistory = async (userId: string, limit = 10): Promise<User.Measurements> => {
    // Ensure user has measurements
    const measurements = await ensureUserMeasurements(userId);

    const weights: User.MeasurementData[] = await prisma.weightMeasurement.findMany({
        where: { userMeasurementsId: measurements.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            value: true,
            createdAt: true
        }
    });
    const heights: User.MeasurementData[] = await prisma.heightMeasurement.findMany({
        where: { userMeasurementsId: measurements.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            value: true,
            createdAt: true
        }
    });
    const bodyFats: User.MeasurementData[] = await prisma.bodyFatMeasurement.findMany({
        where: { userMeasurementsId: measurements.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            value: true,
            createdAt: true
        }
    });

    return {
        weights,
        heights,
        bodyFats,
    }

};

/**
 * Adds a new weight measurement for a user
 * @param userId The user's unique identifier
 * @param value The weight value to record (in kg)
 * @returns The created measurement data
 * @throws Error if the operation fails
 */
export const addWeightMeasurement = async (userId: string, value: number): Promise<User.MeasurementData> => {
    // Ensure user has measurements
    const { id } = await ensureUserMeasurements(userId);

    const { userMeasurementsId, ...measurement } = await prisma.weightMeasurement.create({
        data: {
            userMeasurementsId: id,
            value,
        }
    });
    return measurement;
};

/**
 * Adds a new height measurement for a user
 * @param userId The user's unique identifier
 * @param value The height value to record (in cm)
 * @returns The created measurement data
 * @throws Error if the operation fails
 */
export const addHeightMeasurement = async (userId: string, value: number): Promise<User.MeasurementData> => {
    // Ensure user has measurements
    const { id } = await ensureUserMeasurements(userId);

    const { userMeasurementsId, ...measurement } = await prisma.heightMeasurement.create({
        data: {
            userMeasurementsId: id,
            value,
        }
    });
    return measurement;
};

/**
 * Adds a new body fat percentage measurement for a user
 * @param userId The user's unique identifier
 * @param value The body fat percentage value to record
 * @returns The created measurement data
 * @throws Error if the operation fails
 */
export const addBodyFatMeasurement = async (userId: string, value: number): Promise<User.MeasurementData> => {
    // Ensure user has measurements
    const { id } = await ensureUserMeasurements(userId);

    const { userMeasurementsId, ...measurement } = await prisma.bodyFatMeasurement.create({
        data: {
            userMeasurementsId: id,
            value,
        }
    });
    return measurement;
};