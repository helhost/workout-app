import { PrismaClient } from '@prisma/client';
import { Workout } from '@shared';

const prisma = new PrismaClient();

/**
 * Creates a new workout for a user
 * @param userId The user's unique identifier
 * @param workoutData Data for the new workout
 * @returns Created workout
 */
export const createWorkout = async (
    userId: string,
    workoutData: {
        name: string;
        notes?: string;
    }
): Promise<Workout.BaseWorkout> => {
    return await prisma.workout.create({
        data: {
            userId,
            name: workoutData.name,
            notes: workoutData.notes,
            completed: false,
        }
    });
};

/**
 * Gets a specific workout with all related data
 * @param workoutId The workout's unique identifier
 * @param userId User ID for permission verification
 * @returns Complete workout with exercises, sets, and supersets
 * @throws Error if workout not found or doesn't belong to user
 */
export const getWorkoutById = async (
    workoutId: string,
    userId: string
): Promise<Workout.WorkoutFull> => {
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        include: {
            exercises: {
                where: {
                    supersetId: null
                },
                include: {
                    sets: {
                        orderBy: { order: 'asc' }
                    },
                    dropsets: {
                        include: {
                            subSets: {
                                orderBy: { order: 'asc' }
                            }
                        },
                        orderBy: { order: 'asc' }
                    }
                },
                orderBy: { order: 'asc' }
            },
            supersets: {
                include: {
                    exercises: {
                        include: {
                            sets: {
                                orderBy: { order: 'asc' }
                            },
                            dropsets: {
                                include: {
                                    subSets: {
                                        orderBy: { order: 'asc' }
                                    }
                                },
                                orderBy: { order: 'asc' }
                            }
                        },
                        orderBy: { order: 'asc' }
                    }
                },
                orderBy: { order: 'asc' }
            }
        }
    });

    // Verify that this workout belongs to the user
    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    // Transform to match Workout.WorkoutFull type
    const workoutItems: Workout.WorkoutItem[] = [
        ...workout.exercises.map(exercise => ({
            ...exercise,
            type: 'exercise' as const,
            sets: exercise.sets.map(set => ({
                weight: set.weight,
                reps: set.reps,
                notes: set.notes,
                order: set.order
            })),
            dropsets: exercise.dropsets.map(dropset => ({
                notes: dropset.notes,
                order: dropset.order,
                subSets: dropset.subSets.map(subset => ({
                    weight: subset.weight,
                    reps: subset.reps,
                    order: subset.order
                }))
            }))
        })),
        ...workout.supersets.map(superset => ({
            ...superset,
            type: 'superset' as const,
            exercises: superset.exercises.map(exercise => ({
                ...exercise,
                type: 'exercise' as const,
                sets: exercise.sets.map(set => ({
                    weight: set.weight,
                    reps: set.reps,
                    notes: set.notes,
                    order: set.order
                })),
                dropsets: exercise.dropsets.map(dropset => ({
                    notes: dropset.notes,
                    order: dropset.order,
                    subSets: dropset.subSets.map(subset => ({
                        weight: subset.weight,
                        reps: subset.reps,
                        order: subset.order
                    }))
                }))
            }))
        }))
    ];

    return {
        id: workout.id,
        name: workout.name,
        startTime: workout.startTime,
        endTime: workout.endTime,
        notes: workout.notes,
        completed: workout.completed,
        items: workoutItems
    };
};

/**
 * Gets paginated list of workouts for a user
 * @param userId The user's unique identifier
 * @param options Pagination and filter options
 * @returns Paginated list of workouts and pagination metadata
 */
export const getWorkoutsList = async (
    userId: string,
    options: {
        limit?: number;
        offset?: number;
        completed?: boolean;
        startDate?: Date;
        endDate?: Date;
    } = {}
): Promise<{
    workouts: Workout.WorkoutSummary[];
    pagination: {
        total: number;
        offset: number;
        limit: number;
    };
}> => {
    try {
        const {
            limit = 10,
            offset = 0,
            completed,
            startDate,
            endDate
        } = options;

        // Build where conditions
        const where: any = { userId };

        // Filter by completion status if specified
        if (completed !== undefined) {
            where.completed = completed;
        }

        // Filter by date range if specified
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }

        // Get total count for pagination
        const totalCount = await prisma.workout.count({ where });

        // Get paginated workouts
        const workouts = await prisma.workout.findMany({
            where,
            select: {
                id: true,
                name: true,
                createdAt: true,
                completed: true,
                startTime: true,
                endTime: true,
                _count: {
                    select: {
                        exercises: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit
        });

        // Transform to match Workout.WorkoutSummary type
        const workoutSummaries: Workout.WorkoutSummary[] = workouts.map(workout => {
            // Calculate duration if workout has start and end times
            let duration = undefined;
            if (workout.startTime && workout.endTime) {
                duration = workout.endTime.getTime() - workout.startTime.getTime();
            }

            return {
                id: workout.id,
                name: workout.name,
                createdAt: workout.createdAt,
                completed: workout.completed,
                exerciseCount: workout._count.exercises,
                duration
            };
        });

        return {
            workouts: workoutSummaries,
            pagination: {
                total: totalCount,
                offset,
                limit
            }
        };
    } catch (error) {
        console.error('getWorkoutsList service error:', error);
        throw error;
    }
};

/**
 * Updates workout details
 * @param workoutId The workout's unique identifier
 * @param userId User ID for permission verification
 * @param data Updated workout data
 * @returns Updated workout
 * @throws Error if workout not found or doesn't belong to user
 */
export const updateWorkout = async (
    workoutId: string,
    userId: string,
    data: {
        name?: string;
        notes?: string;
        completed?: boolean;
    }
): Promise<Workout.BaseWorkout> => {
    // First check if workout exists and belongs to user
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    return await prisma.workout.update({
        where: { id: workoutId },
        data
    });
};

/**
 * Starts a workout by setting the startTime
 * @param workoutId The workout's unique identifier
 * @param userId User ID for permission verification
 * @returns Updated workout with startTime
 * @throws Error if workout not found, doesn't belong to user, or has already been started
 */
export const startWorkout = async (
    workoutId: string,
    userId: string
): Promise<Workout.BaseWorkout> => {
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true, startTime: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    if (workout.startTime) {
        throw new Error('Workout has already been started');
    }

    return await prisma.workout.update({
        where: { id: workoutId },
        data: {
            startTime: new Date(),
            completed: false
        }
    });
};

/**
 * Ends a workout by setting the endTime and marking as completed
 * @param workoutId The workout's unique identifier
 * @param userId User ID for permission verification
 * @returns Updated workout with endTime and completed status
 * @throws Error if workout not found, doesn't belong to user, hasn't been started, or has already ended
 */
export const endWorkout = async (
    workoutId: string,
    userId: string
): Promise<Workout.BaseWorkout> => {
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true, startTime: true, endTime: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    if (!workout.startTime) {
        throw new Error('Workout has not been started yet');
    }

    if (workout.endTime) {
        throw new Error('Workout has already been ended');
    }

    return await prisma.workout.update({
        where: { id: workoutId },
        data: {
            endTime: new Date(),
            completed: true
        }
    });
};

/**
 * Deletes a workout
 * @param workoutId The workout's unique identifier
 * @param userId User ID for permission verification
 * @throws Error if workout not found or doesn't belong to user
 */
export const deleteWorkout = async (
    workoutId: string,
    userId: string
): Promise<void> => {
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    await prisma.workout.delete({
        where: { id: workoutId }
    });
};