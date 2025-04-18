import { Workout } from '@shared';

/**
 * Generates a unique ID with a specific prefix
 */
export const generateId = (prefix: string): string => {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Creates a new empty set with default values
 */
export const createDefaultSet = (): Workout.ExerciseSet => ({
    weight: 0,
    reps: 10,
    notes: null,
    order: 0,
    completed: false,
});

/**
 * Creates a new empty exercise with default values
 */
export const createDefaultExercise = (): Workout.Exercise => ({
    id: generateId('ex'),
    name: '',
    muscleGroup: 'fullBody',
    sets: [createDefaultSet()],
    dropsets: [],
    notes: '',
    type: 'exercise',
    order: 0
});

/**
 * Creates a new superset with an initial exercise
 */
export const createDefaultSuperset = (initialExercise?: Workout.Exercise): Workout.Superset => ({
    id: generateId('ss'),
    type: 'superset',
    exercises: initialExercise ? [initialExercise] : [createDefaultExercise()],
    notes: '',
    order: 0
});

/**
 * Creates a default workout object with the minimal fields needed for the form
 * We use Partial<Workout.WorkoutFull> to allow for incomplete workout objects during form editing
 */
export const createDefaultWorkout = (): Partial<Workout.WorkoutFull> => ({
    id: generateId('workout'),
    name: '',
    startTime: null,
    endTime: null,
    items: [],
    completed: false,
    notes: ''
});

/**
 * Checks if all sets in a workout are completed
 */
export const isWorkoutCompleted = (workout: Workout.WorkoutFull): boolean => {
    // Get all sets from all items (exercises and supersets)
    const allSets: Workout.ExerciseSet[] = [];

    workout.items.forEach(item => {
        if (item.type === 'superset') {
            item.exercises.forEach(exercise => {
                allSets.push(...exercise.sets);
            });
        } else {
            // It's a regular exercise
            allSets.push(...(item as Workout.Exercise).sets);
        }
    });

    // Check if there are any sets and if all of them are completed
    return allSets.length > 0 && allSets.every(set => set.completed === true);
};

/**
 * Available muscle group options for the select dropdown
 */
export const muscleGroupOptions = [
    { label: "Chest", value: "chest" as Workout.MuscleGroup },
    { label: "Back", value: "back" as Workout.MuscleGroup },
    { label: "Shoulders", value: "shoulders" as Workout.MuscleGroup },
    { label: "Biceps", value: "biceps" as Workout.MuscleGroup },
    { label: "Triceps", value: "triceps" as Workout.MuscleGroup },
    { label: "Legs", value: "legs" as Workout.MuscleGroup },
    { label: "Quads", value: "quads" as Workout.MuscleGroup },
    { label: "Core", value: "core" as Workout.MuscleGroup },
    { label: "Cardio", value: "cardio" as Workout.MuscleGroup },
    { label: "Full Body", value: "fullBody" as Workout.MuscleGroup }
];