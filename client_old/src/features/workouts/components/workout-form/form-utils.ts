import { Exercise, Set, SuperSet, Workout, MuscleGroup } from '../../types';

/**
 * Generates a unique ID with a specific prefix
 */
export const generateId = (prefix: string): string => {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Creates a new empty set with default values
 */
export const createDefaultSet = (): Set => ({
    id: generateId('set'),
    weight: 0,
    reps: 10,
    completed: false
});

/**
 * Creates a new empty exercise with default values
 */
export const createDefaultExercise = (): Exercise => ({
    id: generateId('ex'),
    name: '',
    muscleGroup: 'fullBody',
    sets: [createDefaultSet()],
    notes: ''
});

/**
 * Creates a new superset with an initial exercise
 */
export const createSuperset = (initialExercise?: Exercise): SuperSet => ({
    id: generateId('ss'),
    type: 'superset',
    exercises: initialExercise ? [initialExercise] : [createDefaultExercise()],
    notes: ''
});

/**
 * Creates a default workout object
 */
export const createDefaultWorkout = (): Workout => ({
    id: generateId('workout'),
    name: '',
    date: new Date().toISOString(),
    items: [],
    completed: false
});

/**
 * Checks if all sets in a workout are completed
 */
export const isWorkoutCompleted = (workout: Workout): boolean => {
    // Get all sets from all items (exercises and supersets)
    const allSets: Set[] = [];

    workout.items.forEach(item => {
        if ('type' in item && item.type === 'superset') {
            // It's a superset
            item.exercises.forEach(exercise => {
                allSets.push(...exercise.sets);
            });
        } else {
            // It's a regular exercise
            allSets.push(...(item as Exercise).sets);
        }
    });

    // Check if there are any sets and if all of them are completed
    return allSets.length > 0 && allSets.every(set => set.completed);
};

/**
 * Get all available muscle groups with labels
 */
export const muscleGroupOptions = [
    { label: "Chest", value: "chest" as MuscleGroup },
    { label: "Back", value: "back" as MuscleGroup },
    { label: "Shoulders", value: "shoulders" as MuscleGroup },
    { label: "Biceps", value: "biceps" as MuscleGroup },
    { label: "Triceps", value: "triceps" as MuscleGroup },
    { label: "Legs", value: "legs" as MuscleGroup },
    { label: "Core", value: "core" as MuscleGroup },
    { label: "Cardio", value: "cardio" as MuscleGroup },
    { label: "Full Body", value: "fullBody" as MuscleGroup }
];