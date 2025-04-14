import { Workout, WorkoutItemType, MuscleGroup } from './types';

// Transform backend workout to frontend Workout type
export const transformWorkout = (backendWorkout: any): Workout => {
    // Create a function to transform exercises and supersets
    const transformItems = (): WorkoutItemType[] => {
        const items: WorkoutItemType[] = [];

        // Transform regular exercises
        if (backendWorkout.exercises) {
            backendWorkout.exercises.forEach((exercise: any) => {
                items.push({
                    id: exercise.id,
                    name: exercise.name,
                    muscleGroup: exercise.muscleGroup as MuscleGroup,
                    type: 'exercise',
                    sets: exercise.sets.map((set: any) => ({
                        id: set.id,
                        weight: set.weight,
                        reps: set.reps,
                        completed: set.completed,
                        notes: set.notes
                    })),
                    notes: exercise.notes
                });
            });
        }

        // Transform supersets
        if (backendWorkout.supersets) {
            backendWorkout.supersets.forEach((superset: any) => {
                items.push({
                    id: superset.id,
                    type: 'superset',
                    exercises: superset.exercises.map((exercise: any) => ({
                        id: exercise.id,
                        name: exercise.name,
                        muscleGroup: exercise.muscleGroup as MuscleGroup,
                        sets: exercise.sets.map((set: any) => ({
                            id: set.id,
                            weight: set.weight,
                            reps: set.reps,
                            completed: set.completed,
                            notes: set.notes
                        })),
                        notes: exercise.notes
                    })),
                    notes: superset.notes
                });
            });
        }

        return items;
    };

    return {
        id: backendWorkout.id,
        name: backendWorkout.name,
        date: backendWorkout.date,
        items: transformItems(),
        duration: backendWorkout.startTime && backendWorkout.endTime
            ? Math.round((new Date(backendWorkout.endTime).getTime() - new Date(backendWorkout.startTime).getTime()) / 60000)
            : undefined,
        notes: backendWorkout.notes,
        completed: backendWorkout.completed
    };
};

// Calculate total number of exercises in a workout
export const calculateExerciseCount = (workout: Workout): number => {
    return workout.items.reduce((count, item) => {
        if ('type' in item && item.type === 'superset') {
            // Count both exercises in the superset
            return count + (item.exercises?.length || 0);
        } else {
            // Count the single exercise
            return count + 1;
        }
    }, 0);
};

// Calculate total number of sets in a workout
export const calculateSetCount = (workout: Workout): number => {
    return workout.items.reduce((total, item) => {
        if ('type' in item && item.type === 'superset') {
            // For superset, count sets from all its exercises
            return total + item.exercises.reduce(
                (subTotal, exercise) => subTotal + (exercise.sets?.length || 0),
                0
            );
        } else if ('sets' in item) {
            // For regular exercise, count its sets
            return total + (item.sets.length || 0);
        } else return 0;
    }, 0);
};