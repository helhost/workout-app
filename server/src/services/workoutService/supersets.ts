// src/services/workoutService/supersets.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a superset to a workout
export const addSupersetToWorkout = async (
    workoutId: string,
    userId: string,
    data: {
        notes?: string;
        order: number;
    }
) => {
    // Verify workout belongs to user
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    return prisma.superset.create({
        data: {
            workoutId,
            notes: data.notes,
            order: data.order,
        }
    });
};

// Update a superset
export const updateSuperset = async (
    supersetId: string,
    userId: string,
    data: {
        notes?: string;
        order?: number;
    }
) => {
    // Verify superset belongs to user
    const superset = await prisma.superset.findUnique({
        where: { id: supersetId },
        include: { workout: { select: { userId: true } } }
    });

    if (!superset || superset.workout.userId !== userId) {
        throw new Error('Superset not found');
    }

    return prisma.superset.update({
        where: { id: supersetId },
        data
    });
};

// Delete a superset
export const deleteSuperset = async (supersetId: string, userId: string) => {
    // Verify superset belongs to user
    const superset = await prisma.superset.findUnique({
        where: { id: supersetId },
        include: { workout: { select: { userId: true } } }
    });

    if (!superset || superset.workout.userId !== userId) {
        throw new Error('Superset not found');
    }

    return prisma.superset.delete({
        where: { id: supersetId }
    });
};