import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add an exercise to a workout
export const addExerciseToWorkout = async (
    workoutId: string,
    userId: string,
    exerciseData: {
        name: string;
        muscleGroup: string;
        notes?: string;
        isDropSet?: boolean;
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

    return prisma.exercise.create({
        data: {
            workoutId,
            name: exerciseData.name,
            muscleGroup: exerciseData.muscleGroup,
            notes: exerciseData.notes,
            isDropSet: exerciseData.isDropSet || false,
            order: exerciseData.order,
        }
    });
};

// Add an exercise to a superset
export const addExerciseToSuperset = async (
    supersetId: string,
    userId: string,
    exerciseData: {
        name: string;
        muscleGroup: string;
        notes?: string;
        isDropSet?: boolean;
        order: number;
    }
) => {
    // Verify superset belongs to user's workout
    const superset = await prisma.superset.findUnique({
        where: { id: supersetId },
        include: { workout: { select: { userId: true } } }
    });

    if (!superset || superset.workout.userId !== userId) {
        throw new Error('Superset not found');
    }

    return prisma.exercise.create({
        data: {
            supersetId,
            name: exerciseData.name,
            muscleGroup: exerciseData.muscleGroup,
            notes: exerciseData.notes,
            isDropSet: exerciseData.isDropSet || false,
            order: exerciseData.order,
        }
    });
};

// Update an exercise
export const updateExercise = async (
    exerciseId: string,
    userId: string,
    data: {
        name?: string;
        muscleGroup?: string;
        notes?: string;
        isDropSet?: boolean;
        order?: number;
    }
) => {
    // Verify exercise belongs to user
    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: {
            workout: { select: { userId: true } },
            superset: { include: { workout: { select: { userId: true } } } }
        }
    });

    if (!exercise) {
        throw new Error('Exercise not found');
    }

    // Check if exercise belongs to user's workout directly or via a superset
    const exerciseUserId = exercise.workout?.userId || exercise.superset?.workout.userId;
    if (exerciseUserId !== userId) {
        throw new Error('Exercise not found');
    }

    return prisma.exercise.update({
        where: { id: exerciseId },
        data
    });
};

// Delete an exercise
export const deleteExercise = async (exerciseId: string, userId: string) => {
    // Verify exercise belongs to user
    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: {
            workout: { select: { userId: true } },
            superset: { include: { workout: { select: { userId: true } } } }
        }
    });

    if (!exercise) {
        throw new Error('Exercise not found');
    }

    // Check if exercise belongs to user's workout directly or via a superset
    const exerciseUserId = exercise.workout?.userId || exercise.superset?.workout.userId;
    if (exerciseUserId !== userId) {
        throw new Error('Exercise not found');
    }

    return prisma.exercise.delete({
        where: { id: exerciseId }
    });
};