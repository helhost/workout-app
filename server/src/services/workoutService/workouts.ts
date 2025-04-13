import { PrismaClient, Workout } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new workout
export const createWorkout = async (userId: string, workoutData: {
    name: string;
    date: Date;
    notes?: string;
    completed?: boolean;
}) => {
    return prisma.workout.create({
        data: {
            userId,
            name: workoutData.name,
            date: workoutData.date,
            notes: workoutData.notes,
            completed: workoutData.completed || false,
        }
    });
};

// Get a specific workout with all related data
export const getWorkoutById = async (workoutId: string, userId: string) => {
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        include: {
            exercises: {
                include: {
                    sets: {
                        include: {
                            subSets: true
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
                                include: {
                                    subSets: true
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

    return workout;
};

// Get all workouts for a user
export const getUserWorkouts = async (userId: string, {
    limit = 10,
    offset = 0,
    completed,
    startDate,
    endDate
}: {
    limit?: number;
    offset?: number;
    completed?: boolean;
    startDate?: Date;
    endDate?: Date;
} = {}) => {
    // Build where conditions
    const where: any = { userId };

    // Filter by completion status if specified
    if (completed !== undefined) {
        where.completed = completed;
    }

    // Filter by date range if specified
    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startDate;
        if (endDate) where.date.lte = endDate;
    }

    // Get total count for pagination
    const totalCount = await prisma.workout.count({ where });

    // Get paginated workouts
    const workouts = await prisma.workout.findMany({
        where,
        include: {
            exercises: {
                select: { id: true },
            },
            supersets: {
                select: { id: true },
                include: {
                    exercises: {
                        select: { id: true }
                    }
                }
            }
        },
        orderBy: { date: 'desc' },
        skip: offset,
        take: limit
    });

    return {
        workouts,
        pagination: {
            total: totalCount,
            offset,
            limit
        }
    };
};

// Update workout details
export const updateWorkout = async (workoutId: string, userId: string, data: {
    name?: string;
    date?: Date;
    notes?: string;
    completed?: boolean;
}) => {
    // First check if workout exists and belongs to user
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    return prisma.workout.update({
        where: { id: workoutId },
        data
    });
};

// Start a workout (set startTime)
export const startWorkout = async (workoutId: string, userId: string) => {
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

    return prisma.workout.update({
        where: { id: workoutId },
        data: {
            startTime: new Date(),
            completed: false
        }
    });
};

// End a workout (set endTime and mark as completed)
export const endWorkout = async (workoutId: string, userId: string) => {
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

    return prisma.workout.update({
        where: { id: workoutId },
        data: {
            endTime: new Date(),
            completed: true
        }
    });
};

// Delete a workout
export const deleteWorkout = async (workoutId: string, userId: string) => {
    const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true }
    });

    if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found');
    }

    return prisma.workout.delete({
        where: { id: workoutId }
    });
};