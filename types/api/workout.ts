// Workout related API types
import { WorkoutModels } from '../models/workout';
import { UserModels } from '../models';
import { API } from './index';

export namespace WorkoutAPI {
    // Request parameters
    export interface GetWorkoutsParams extends API.PaginationParams {
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
        muscleGroup: WorkoutModels.MuscleGroup;
        notes?: string;
        isDropSet?: boolean;
        order: number;
    }

    export interface UpdateExerciseRequest {
        name?: string;
        muscleGroup?: WorkoutModels.MuscleGroup;
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
        workouts: WorkoutModels.WorkoutSummary[];
        pagination: API.PaginationMeta;
    }

    export interface GetWorkoutByIdResponse {
        message: string;
        workout: WorkoutModels.Workout;
    }

    export interface WorkoutActionResponse {
        message: string;
        workout: WorkoutModels.Workout;
    }

    export interface WorkoutDeleteResponse {
        message: string;
    }

    export interface ExerciseResponse {
        message: string;
        exercise: WorkoutModels.Exercise;
    }

    export interface ExerciseDeleteResponse {
        message: string;
    }

    export interface SupersetResponse {
        message: string;
        superset: WorkoutModels.SuperSet;
    }

    export interface SupersetDeleteResponse {
        message: string;
    }

    export interface SetResponse {
        message: string;
        set: WorkoutModels.Set;
    }

    export interface SetDeleteResponse {
        message: string;
    }

    export interface LatestMeasurementsResponse {
        message: string;
        measurements: UserModels.UserMeasurements;
    }

    export interface MeasurementHistoryResponse {
        message: string;
        history: UserModels.MeasurementHistory[];
    }

    export interface AddMeasurementResponse {
        message: string;
        measurement: UserModels.MeasurementHistory;
    }
}