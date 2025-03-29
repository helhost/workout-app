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
    restTimeSec?: number;
}

export interface Workout {
    id: string;
    name: string;
    date: string; // ISO date string
    exercises: Exercise[];
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

// Component props types - only include what we need for WorkoutsList for now
export interface WorkoutsListProps {
    workouts: Workout[];
    onWorkoutClick?: (workout: Workout) => void;
    className?: string;
}