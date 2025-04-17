import { PrismaClient } from '@prisma/client';
import { Workout } from '@shared';
import e from 'express';

const prisma = new PrismaClient();

/**
 * Adds an exercise to a workout
 * @param workoutId The workout's unique identifier
 * @param userId User ID for permission verification
 * @param exerciseData Data for the new exercise
 * @returns Created exercise
 * @throws Error if workout not found or doesn't belong to user
 */
export const addExerciseToWorkout = async (
    workoutId: string,
    userId: string,
    exerciseData: Workout.ExerciseData
): Promise<Workout.Exercise> => {
    // Verify workout belongs to user
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    const exercise = await prisma.exercise.create({
        data: {
            workoutId,
            name: exerciseData.name,
            muscleGroup: exerciseData.muscleGroup,
            notes: exerciseData.notes,
            order: exerciseData.order,
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

    return { ...exercise, type: 'exercise' }
};

/**
 * Updates an exercise
 * @param exerciseId The exercise's unique identifier
 * @param userId User ID for permission verification
 * @param data Updated exercise data
 * @returns Updated exercise
 * @throws Error if exercise not found or doesn't belong to user
 */
export const updateExercise = async (
    exerciseId: string,
    userId: string,
    data: Partial<Workout.ExerciseData>
): Promise<Workout.Exercise> => {
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

    const updated_exercise = await prisma.exercise.update({
        where: { id: exerciseId },
        data,
        include: {
            sets: true,
            dropsets: {
                include: {
                    subSets: true
                }
            }
        }
    });

    return { ...updated_exercise, type: 'exercise' };
};

/**
 * Deletes an exercise
 * @param exerciseId The exercise's unique identifier
 * @param userId User ID for permission verification
 * @throws Error if exercise not found or doesn't belong to user
 */
export const deleteExercise = async (exerciseId: string, userId: string): Promise<void> => {
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

    await prisma.exercise.delete({
        where: { id: exerciseId }
    });
};