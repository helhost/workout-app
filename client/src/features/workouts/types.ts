// Core data types
export interface Set {
    id: string;
    weight: number;
    reps: number;
    completed: boolean;
    notes?: string;
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    sets: Set[];
    notes?: string;
    type: 'exercise'; // Type discriminator to differentiate from SuperSet
}

// WorkoutItem can be either a single Exercise or a SuperSet
export type WorkoutItemType = Exercise | SuperSet;

export interface SuperSet {
    id: string;
    type: 'superset'; // Type discriminator to differentiate from Exercise
    exercises: Exercise[]; // Always contains exactly 2 exercises
    notes?: string;
}

export interface Workout {
    id: string;
    name: string;
    date: string; // ISO date string
    items: WorkoutItemType[]; // Unified list of exercises and supersets
    duration?: number; // in minutes
    notes?: string;
    completed: boolean;
}

export type MuscleGroup =
    | 'chest'
    | 'back'
    | 'shoulders'
    | 'biceps'
    | 'triceps'
    | 'legs'
    | 'core'
    | 'cardio'
    | 'fullBody';

// Helper function to check if a workout item is a superset
export function isSuperset(item: WorkoutItemType): item is SuperSet {
    return 'type' in item && item.type === 'superset';
}

// Component props types
export interface WorkoutsListProps {
    workouts: Workout[];
    onWorkoutClick?: (workout: Workout) => void;
    className?: string;
}

export interface WorkoutItemProps {
    workout: Workout;
    onClick?: (workout: Workout) => void;
    className?: string;
}