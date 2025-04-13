import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a set to an exercise
export const addSetToExercise = async (
    exerciseId: string,
    userId: string,
    setData: {
        weight: number;
        reps: number;
        completed?: boolean;
        notes?: string;
        order: number;
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

    return prisma.exerciseSet.create({
        data: {
            exerciseId,
            weight: setData.weight,
            reps: setData.reps,
            completed: setData.completed || false,
            notes: setData.notes,
            order: setData.order,
        }
    });
};

// Update a set
export const updateSet = async (
    setId: string,
    userId: string,
    data: {
        weight?: number;
        reps?: number;
        completed?: boolean;
        notes?: string;
        order?: number;
    }
) => {
    // Verify set belongs to user
    const set = await prisma.exerciseSet.findUnique({
        where: { id: setId },
        include: {
            exercise: {
                include: {
                    workout: { select: { userId: true } },
                    superset: { include: { workout: { select: { userId: true } } } }
                }
            }
        }
    });

    if (!set) {
        throw new Error('Set not found');
    }

    // Check if set belongs to user's exercise directly or via a superset
    const setUserId = set.exercise.workout?.userId || set.exercise.superset?.workout.userId;
    if (setUserId !== userId) {
        throw new Error('Set not found');
    }

    return prisma.exerciseSet.update({
        where: { id: setId },
        data
    });
};

// Delete a set
export const deleteSet = async (setId: string, userId: string) => {
    // Verify set belongs to user
    const set = await prisma.exerciseSet.findUnique({
        where: { id: setId },
        include: {
            exercise: {
                include: {
                    workout: { select: { userId: true } },
                    superset: { include: { workout: { select: { userId: true } } } }
                }
            }
        }
    });

    if (!set) {
        throw new Error('Set not found');
    }

    // Check if set belongs to user's exercise directly or via a superset
    const setUserId = set.exercise.workout?.userId || set.exercise.superset?.workout.userId;
    if (setUserId !== userId) {
        throw new Error('Set not found');
    }

    return prisma.exerciseSet.delete({
        where: { id: setId }
    });
};

// Add a subset to a set (for dropsets)
export const addSubSetToSet = async (
    setId: string,
    userId: string,
    subSetData: {
        weight: number;
        reps: number;
        completed?: boolean;
        order: number;
    }
) => {
    // Verify set belongs to user and make sure it's part of a dropset exercise
    const set = await prisma.exerciseSet.findUnique({
        where: { id: setId },
        include: {
            exercise: {
                include: {
                    workout: { select: { userId: true } },
                    superset: { include: { workout: { select: { userId: true } } } }
                }
            }
        }
    });

    if (!set) {
        throw new Error('Set not found');
    }

    // Check if set belongs to user's exercise directly or via a superset
    const setUserId = set.exercise.workout?.userId || set.exercise.superset?.workout.userId;
    if (setUserId !== userId) {
        throw new Error('Set not found');
    }

    // Check if this exercise is marked as a dropset
    if (!set.exercise.isDropSet) {
        throw new Error('This exercise is not configured as a dropset');
    }

    return prisma.subSet.create({
        data: {
            exerciseSetId: setId,
            weight: subSetData.weight,
            reps: subSetData.reps,
            completed: subSetData.completed || false,
            order: subSetData.order,
        }
    });
};

// Update a subset
export const updateSubSet = async (
    subSetId: string,
    userId: string,
    data: {
        weight?: number;
        reps?: number;
        completed?: boolean;
        order?: number;
    }
) => {
    // Verify subset belongs to user
    const subSet = await prisma.subSet.findUnique({
        where: { id: subSetId },
        include: {
            exerciseSet: {
                include: {
                    exercise: {
                        include: {
                            workout: { select: { userId: true } },
                            superset: { include: { workout: { select: { userId: true } } } }
                        }
                    }
                }
            }
        }
    });

    if (!subSet) {
        throw new Error('SubSet not found');
    }

    // Check if subset belongs to user's set
    const subSetUserId =
        subSet.exerciseSet.exercise.workout?.userId ||
        subSet.exerciseSet.exercise.superset?.workout.userId;

    if (subSetUserId !== userId) {
        throw new Error('SubSet not found');
    }

    return prisma.subSet.update({
        where: { id: subSetId },
        data
    });
};

// Delete a subset
export const deleteSubSet = async (subSetId: string, userId: string) => {
    // Verify subset belongs to user
    const subSet = await prisma.subSet.findUnique({
        where: { id: subSetId },
        include: {
            exerciseSet: {
                include: {
                    exercise: {
                        include: {
                            workout: { select: { userId: true } },
                            superset: { include: { workout: { select: { userId: true } } } }
                        }
                    }
                }
            }
        }
    });

    if (!subSet) {
        throw new Error('SubSet not found');
    }

    // Check if subset belongs to user's set
    const subSetUserId =
        subSet.exerciseSet.exercise.workout?.userId ||
        subSet.exerciseSet.exercise.superset?.workout.userId;

    if (subSetUserId !== userId) {
        throw new Error('SubSet not found');
    }

    return prisma.subSet.delete({
        where: { id: subSetId }
    });
};