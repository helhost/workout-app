export namespace WorkoutModels {
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
        muscleGroup: WorkoutModels.MuscleGroup;
        sets: WorkoutModels.Set[];
        notes?: string;
        type: 'exercise';
    }

    export type WorkoutItem = WorkoutModels.Exercise | WorkoutModels.SuperSet;

    export interface SuperSet {
        id: string;
        type: 'superset';
        exercises: WorkoutModels.Exercise[];
        notes?: string;
    }

    export interface Workout {
        id: string;
        name: string;
        date: string;
        items: WorkoutModels.WorkoutItem[];
        duration?: number;
        notes?: string;
        completed: boolean;
        startTime?: string;
        endTime?: string;
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

    export interface WorkoutSummary {
        id: string;
        name: string;
        date: string;
        completed: boolean;
        duration?: number;
        notes?: string;
    }
}

// Helper function to check if a workout item is a superset
export function isSuperset(item: WorkoutModels.WorkoutItem): item is WorkoutModels.SuperSet {
    return 'type' in item && item.type === 'superset';
}