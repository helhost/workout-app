// Workout-related types that match the backend schema
import { Workout } from '@shared';

export type MuscleGroup = Workout.MuscleGroup;

export interface WorkoutBase {
    id: string;
    name: string;
    notes?: string;
    completed: boolean;
    startTime?: Date | string | null;
    endTime?: Date | string | null;
}

export interface WorkoutSummary extends WorkoutBase {
    createdAt: Date | string;
    exerciseCount?: number;
    duration?: number;
    setCount?: number;
    totalVolume?: number;
}

export interface ExerciseSet {
    id?: string;
    weight: number;
    reps: number;
    notes?: string;
    order: number;
    completed?: boolean;
}

export interface DropsetSubSet {
    id?: string;
    weight: number;
    reps: number;
    order: number;
}

export interface Dropset {
    id?: string;
    notes?: string;
    order: number;
    subSets: DropsetSubSet[];
}

export interface ExerciseData {
    name: string;
    muscleGroup: MuscleGroup;
    notes?: string;
    order: number;
}

export interface Exercise extends ExerciseData {
    id: string;
    sets: ExerciseSet[];
    dropsets: Dropset[];
    type: 'exercise';
}

export interface SupersetData {
    notes?: string;
    order: number;
}

export interface Superset extends SupersetData {
    id: string;
    exercises: Exercise[];
    type: 'superset';
}

export type WorkoutItem = Exercise | Superset;

export interface WorkoutFull extends WorkoutBase {
    items: WorkoutItem[];
}

export interface PaginationParams {
    limit?: number;
    offset?: number;
}

export interface WorkoutFilters {
    completed?: boolean;
    startDate?: Date | string;
    endDate?: Date | string;
}

export interface PaginationResult {
    total: number;
    offset: number;
    limit: number;
}

export interface WorkoutListResponse {
    workouts: WorkoutSummary[];
    pagination: PaginationResult;
}

// Used for the form components
export interface Set extends ExerciseSet {
    completed: boolean;
}

// Helper function to check if a workout item is a superset
export function isSuperset(item: WorkoutItem): item is Superset {
    return item.type === 'superset';
}

// Additional types for frontend usage
export interface CreateWorkoutData {
    name: string;
    notes?: string;
}

export interface UpdateWorkoutData {
    name?: string;
    notes?: string;
    completed?: boolean;
}