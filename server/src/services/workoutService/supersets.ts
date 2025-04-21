import { PrismaClient } from '@prisma/client';
import { Workout } from '@shared';

const prisma = new PrismaClient();

/**
 * Adds a superset to a workout
 * @param workoutId The workout's unique identifier
 * @param userId User ID for permission verification
 * @param data Data for the new superset
 * @returns Created superset
 * @throws Error if workout not found or doesn't belong to user
 */
export const addSupersetToWorkout = async (
    workoutId: string,
    userId: string,
    data: Workout.SupersetData
): Promise<Workout.Superset> => {
    // Verify workout belongs to user
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    const superset = await prisma.superset.create({
        data: {
            workoutId,
            notes: data.notes,
            order: data.order,
        }
    });

    return { ...superset, exercises: [], type: 'superset' };
};

/**
 * Updates a superset
 * @param supersetId The superset's unique identifier
 * @param userId User ID for permission verification
 * @param data Updated superset data
 * @returns Updated superset
 * @throws Error if superset not found or doesn't belong to user
 */
export const updateSuperset = async (
    supersetId: string,
    userId: string,
    data: {
        notes?: string;
        order?: number;
    }
): Promise<Workout.Superset> => {
    // Verify superset belongs to user
    const superset = await prisma.superset.findUnique({
        where: { id: supersetId },
        include: { workout: { select: { userId: true } } }
    });

    if (!superset || superset.workout.userId !== userId) {
        throw new Error('Superset not found');
    }

    const updated_set = await prisma.superset.update({
        where: { id: supersetId },
        data
    });

    return { ...updated_set, exercises: [], type: 'superset' };
};

/**
 * Deletes a superset
 * @param supersetId The superset's unique identifier
 * @param userId User ID for permission verification
 * @throws Error if superset not found or doesn't belong to user
 */
export const deleteSuperset = async (supersetId: string, userId: string): Promise<void> => {
    // Verify superset belongs to user
    const superset = await prisma.superset.findUnique({
        where: { id: supersetId },
        include: { workout: { select: { userId: true } } }
    });

    if (!superset || superset.workout.userId !== userId) {
        throw new Error('Superset not found');
    }

    await prisma.superset.delete({
        where: { id: supersetId }
    });
};

/**
 * Adds an exercise to a superset
 * @param supersetId The superset's unique identifier
 * @param userId User ID for permission verification
 * @param exerciseData Data for the new exercise
 * @returns Created exercise
 * @throws Error if superset not found or doesn't belong to user
 */
export const addExerciseToSuperset = async (
    supersetId: string,
    userId: string,
    exerciseData: Workout.ExerciseData
): Promise<Workout.Exercise> => {
    // Verify superset belongs to user
    const superset = await prisma.superset.findUnique({
        where: { id: supersetId },
        include: { workout: { select: { userId: true } } }
    });

    if (!superset || superset.workout.userId !== userId) {
        throw new Error('Superset not found');
    }

    const exercise = await prisma.exercise.create({
        data: {
            name: exerciseData.name,
            muscleGroup: exerciseData.muscleGroup,
            notes: exerciseData.notes,
            order: exerciseData.order,
            supersetId
        },
        include: {
            sets: true,
            dropsets: {
                include: {
                    subSets: true
                }
            }
        }
    });

    // Transform to match the Workout.Exercise type
    return {
        id: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        notes: exercise.notes,
        order: exercise.order,
        sets: exercise.sets.map(set => ({
            weight: set.weight,
            reps: set.reps,
            notes: set.notes,
            order: set.order,
            completed: set.completed,
        })),
        dropsets: exercise.dropsets.map(dropset => ({
            notes: dropset.notes,
            order: dropset.order,
            subSets: dropset.subSets.map(subset => ({
                weight: subset.weight,
                reps: subset.reps,
                order: subset.order,
                completed: subset.completed,
            }))
        })),
        type: 'exercise'
    };
};

/**
 * Removes an exercise from a superset
 * @param exerciseId The exercise's unique identifier
 * @param userId User ID for permission verification
 * @throws Error if exercise not found or doesn't belong to user's superset
 */
export const removeExerciseFromSuperset = async (
    exerciseId: string,
    userId: string
): Promise<void> => {
    // Verify exercise belongs to user's superset
    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: {
            superset: {
                include: {
                    workout: { select: { userId: true } }
                }
            }
        }
    });

    if (!exercise || !exercise.superset || exercise.superset.workout.userId !== userId) {
        throw new Error('Exercise not found');
    }

    await prisma.exercise.delete({
        where: { id: exerciseId }
    });
};