import { PrismaClient } from '@prisma/client';
import { Workout } from '@shared';

const prisma = new PrismaClient();

/**
 * Adds a regular set to an exercise
 * @param exerciseId The exercise's unique identifier
 * @param userId User ID for permission verification
 * @param setData Data for the new set
 * @returns Created exercise set
 * @throws Error if exercise not found or doesn't belong to user
 */
export const addSetToExercise = async (
    exerciseId: string,
    userId: string,
    setData: Workout.ExerciseSet
): Promise<Workout.ExerciseSet> => {
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

    return await prisma.exerciseSet.create({
        data: {
            exerciseId,
            weight: setData.weight,
            reps: setData.reps,
            notes: setData.notes,
            order: setData.order,
        }
    });
};

/**
 * Updates a regular exercise set
 * @param setId The set's unique identifier
 * @param userId User ID for permission verification
 * @param data Updated set data
 * @returns Updated exercise set
 * @throws Error if set not found or doesn't belong to user
 */
export const updateSet = async (
    setId: string,
    userId: string,
    data: Partial<Workout.ExerciseSet>
): Promise<Workout.ExerciseSet> => {
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

    return await prisma.exerciseSet.update({
        where: { id: setId },
        data
    });
};

/**
 * Deletes a regular exercise set
 * @param setId The set's unique identifier
 * @param userId User ID for permission verification
 * @returns Deleted exercise set
 * @throws Error if set not found or doesn't belong to user
 */
export const deleteSet = async (setId: string, userId: string): Promise<void> => {
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

    await prisma.exerciseSet.delete({
        where: { id: setId }
    });
};

/**
 * Creates a new dropset for an exercise
 * @param exerciseId The exercise's unique identifier
 * @param userId User ID for permission verification
 * @param dropsetData Data for the new dropset
 * @returns Created dropset with its subsets
 * @throws Error if exercise not found or doesn't belong to user
 */
export const addDropsetToExercise = async (
    exerciseId: string,
    userId: string,
    dropsetData: {
        notes?: string;
        order: number;
        subSets: Workout.DropsetSubSet[];
    }
): Promise<Workout.Dropset> => {
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

    // Create dropset with its subsets
    return await prisma.dropset.create({
        data: {
            exerciseId,
            notes: dropsetData.notes,
            order: dropsetData.order,
            subSets: {
                create: dropsetData.subSets.map((subset, index) => ({
                    weight: subset.weight,
                    reps: subset.reps,
                    order: subset.order ?? index,
                }))
            }
        },
        include: {
            subSets: true
        }
    });
};

/**
 * Updates a dropset
 * @param dropsetId The dropset's unique identifier
 * @param userId User ID for permission verification
 * @param data Updated dropset data
 * @returns Updated dropset
 * @throws Error if dropset not found or doesn't belong to user
 */
export const updateDropset = async (
    dropsetId: string,
    userId: string,
    data: {
        notes?: string;
        order?: number;
    }
): Promise<Workout.Dropset> => {
    // Verify dropset belongs to user
    const dropset = await prisma.dropset.findUnique({
        where: { id: dropsetId },
        include: {
            exercise: {
                include: {
                    workout: { select: { userId: true } },
                    superset: { include: { workout: { select: { userId: true } } } }
                }
            }
        }
    });

    if (!dropset) {
        throw new Error('Dropset not found');
    }

    // Check if dropset belongs to user's exercise
    const dropsetUserId = dropset.exercise.workout?.userId || dropset.exercise.superset?.workout.userId;
    if (dropsetUserId !== userId) {
        throw new Error('Dropset not found');
    }

    return await prisma.dropset.update({
        where: { id: dropsetId },
        data,
        include: {
            subSets: {
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });
};

/**
 * Deletes a dropset and all its subsets
 * @param dropsetId The dropset's unique identifier
 * @param userId User ID for permission verification
 * @returns Deleted dropset
 * @throws Error if dropset not found or doesn't belong to user
 */
export const deleteDropset = async (dropsetId: string, userId: string): Promise<void> => {
    // Verify dropset belongs to user
    const dropset = await prisma.dropset.findUnique({
        where: { id: dropsetId },
        include: {
            exercise: {
                include: {
                    workout: { select: { userId: true } },
                    superset: { include: { workout: { select: { userId: true } } } }
                }
            }
        }
    });

    if (!dropset) {
        throw new Error('Dropset not found');
    }

    // Check if dropset belongs to user's exercise
    const dropsetUserId = dropset.exercise.workout?.userId || dropset.exercise.superset?.workout.userId;
    if (dropsetUserId !== userId) {
        throw new Error('Dropset not found');
    }

    // Prisma will cascade delete the subsets
    await prisma.dropset.delete({
        where: { id: dropsetId },
        include: {
            subSets: true
        }
    });
};

/**
 * Adds a subset to an existing dropset
 * @param dropsetId The dropset's unique identifier
 * @param userId User ID for permission verification
 * @param subSetData Data for the new subset
 * @returns Created dropset subset
 * @throws Error if dropset not found or doesn't belong to user
 */
export const addSubSetToDropset = async (
    dropsetId: string,
    userId: string,
    subSetData: Workout.DropsetSubSet
): Promise<Workout.DropsetSubSet> => {
    // Verify dropset belongs to user
    const dropset = await prisma.dropset.findUnique({
        where: { id: dropsetId },
        include: {
            exercise: {
                include: {
                    workout: { select: { userId: true } },
                    superset: { include: { workout: { select: { userId: true } } } }
                }
            }
        }
    });

    if (!dropset) {
        throw new Error('Dropset not found');
    }

    // Check if dropset belongs to user's exercise
    const dropsetUserId = dropset.exercise.workout?.userId || dropset.exercise.superset?.workout.userId;
    if (dropsetUserId !== userId) {
        throw new Error('Dropset not found');
    }

    return await prisma.dropsetSubSet.create({
        data: {
            dropsetId,
            weight: subSetData.weight,
            reps: subSetData.reps,
            order: subSetData.order,
        }
    });
};

/**
 * Updates a dropset subset
 * @param subSetId The subset's unique identifier
 * @param userId User ID for permission verification
 * @param data Updated subset data
 * @returns Updated dropset subset
 * @throws Error if subset not found or doesn't belong to user
 */
export const updateDropsetSubSet = async (
    subSetId: string,
    userId: string,
    data: Partial<Workout.DropsetSubSet>
): Promise<Workout.DropsetSubSet> => {
    // Verify subset belongs to user
    const subSet = await prisma.dropsetSubSet.findUnique({
        where: { id: subSetId },
        include: {
            dropset: {
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

    // Check if subset belongs to user's dropset
    const subSetUserId =
        subSet.dropset.exercise.workout?.userId ||
        subSet.dropset.exercise.superset?.workout.userId;

    if (subSetUserId !== userId) {
        throw new Error('SubSet not found');
    }

    return await prisma.dropsetSubSet.update({
        where: { id: subSetId },
        data
    });
};

/**
 * Deletes a dropset subset
 * @param subSetId The subset's unique identifier
 * @param userId User ID for permission verification
 * @returns Deleted dropset subset
 * @throws Error if subset not found or doesn't belong to user
 */
export const deleteDropsetSubSet = async (subSetId: string, userId: string): Promise<void> => {
    // Verify subset belongs to user
    const subSet = await prisma.dropsetSubSet.findUnique({
        where: { id: subSetId },
        include: {
            dropset: {
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

    // Check if subset belongs to user's dropset
    const subSetUserId =
        subSet.dropset.exercise.workout?.userId ||
        subSet.dropset.exercise.superset?.workout.userId;

    if (subSetUserId !== userId) {
        throw new Error('SubSet not found');
    }

    await prisma.dropsetSubSet.delete({
        where: { id: subSetId }
    });
};