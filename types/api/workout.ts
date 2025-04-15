// Workout related API types
import { Models } from '..';
import { API } from '..';

export namespace WorkoutAPI {
    // Request parameters
    export interface GetWorkoutsParams extends API.util.PaginationParams {
        completed?: boolean;
        startDate?: Date;
        endDate?: Date;
    }

    // Request types
    export interface CreateWorkoutRequest {
        name: string;
        date: string;
        notes?: string;
    }

    export interface UpdateWorkoutRequest {
        name?: string;
        date?: string;
        notes?: string;
        completed?: boolean;
    }

    export interface AddExerciseRequest {
        name: string;
        muscleGroup: Models.Workout.MuscleGroup;
        notes?: string;
        isDropSet?: boolean;
        order: number;
    }

    export interface UpdateExerciseRequest {
        name?: string;
        muscleGroup?: Models.Workout.MuscleGroup;
        notes?: string;
        isDropSet?: boolean;
        order?: number;
    }

    export interface AddSupersetRequest {
        notes?: string;
        order: number;
    }

    export interface UpdateSupersetRequest {
        notes?: string;
        order?: number;
    }

    export interface AddSetRequest {
        weight: number;
        reps: number;
        completed?: boolean;
        notes?: string;
        order: number;
    }

    export interface UpdateSetRequest {
        weight?: number;
        reps?: number;
        completed?: boolean;
        notes?: string;
        order?: number;
    }

    export interface AddMeasurementRequest {
        value: number;
        date?: string;
    }

    export interface GetMeasurementHistoryParams {
        limit?: number;
        type: 'weight' | 'height' | 'bodyFat';
    }

    // Response types
    export interface GetWorkoutsResponse {
        message: string;
        workouts: Models.Workout.WorkoutSummary[];
        pagination: API.util.PaginationMeta;
    }

    export interface GetWorkoutByIdResponse {
        message: string;
        workout: Models.Workout.Workout;
    }

    export interface WorkoutActionResponse {
        message: string;
        workout: Models.Workout.Workout;
    }

    export interface WorkoutDeleteResponse {
        message: string;
    }

    export interface ExerciseResponse {
        message: string;
        exercise: Models.Workout.Exercise;
    }

    export interface ExerciseDeleteResponse {
        message: string;
    }

    export interface SupersetResponse {
        message: string;
        superset: Models.Workout.SuperSet;
    }

    export interface SupersetDeleteResponse {
        message: string;
    }

    export interface SetResponse {
        message: string;
        set: Models.Workout.Set;
    }

    export interface SetDeleteResponse {
        message: string;
    }

    export interface LatestMeasurementsResponse {
        message: string;
        measurements: Models.User.UserMeasurements;
    }

    export interface MeasurementHistoryResponse {
        message: string;
        history: Models.User.MeasurementHistory[];
    }

    export interface AddMeasurementResponse {
        message: string;
        measurement: Models.User.MeasurementHistory;
    }
}