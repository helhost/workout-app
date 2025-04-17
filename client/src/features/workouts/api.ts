import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';
import {
    WorkoutBase,
    WorkoutFull,
    Exercise,
    Superset,
    ExerciseSet,
    Dropset,
    DropsetSubSet,
    ExerciseData,
    SupersetData,
    PaginationParams,
    WorkoutFilters,
    WorkoutListResponse,
} from '@/types';

/**
 * Fetches a list of workouts with optional filtering and pagination
 * @param params Optional parameters for filtering and pagination
 * @returns Promise with workouts data and pagination information
 */
export const getWorkouts = async (params: PaginationParams & WorkoutFilters = {}): Promise<WorkoutListResponse> => {
    try {
        // Convert params to URL query parameters
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());
        if (params.completed !== undefined) queryParams.append('completed', params.completed.toString());
        if (params.startDate) queryParams.append('startDate', new Date(params.startDate).toISOString());
        if (params.endDate) queryParams.append('endDate', new Date(params.endDate).toISOString());

        const response = await api.get(`/workouts?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Fetches a specific workout by ID
 * @param workoutId The ID of the workout to retrieve
 * @returns Promise with detailed workout data
 */
export const getWorkoutById = async (workoutId: string): Promise<{ message: string; workout: WorkoutFull }> => {
    try {
        const response = await api.get(`/workouts/${workoutId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Creates a new workout
 * @param workoutData Data for the new workout
 * @returns Promise with the created workout
 */
export const createWorkout = async (workoutData: {
    name: string;
    notes?: string;
}): Promise<{ message: string; workout: WorkoutBase }> => {
    try {
        const response = await api.post('/workouts', workoutData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Updates an existing workout's details
 * @param workoutId ID of the workout to update
 * @param workoutData Data to update on the workout
 * @returns Promise with the updated workout
 */
export const updateWorkout = async (
    workoutId: string,
    workoutData: Partial<Pick<WorkoutBase, 'name' | 'notes' | 'completed'>>
): Promise<{ message: string; workout: WorkoutBase }> => {
    try {
        const response = await api.patch(`/workouts/${workoutId}`, workoutData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Deletes a workout
 * @param workoutId ID of the workout to delete
 * @returns Promise with success message
 */
export const deleteWorkout = async (workoutId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/workouts/${workoutId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Starts a workout (marks start time)
 * @param workoutId ID of the workout to start
 * @returns Promise with updated workout data
 */
export const startWorkout = async (workoutId: string): Promise<{ message: string; workout: WorkoutBase }> => {
    try {
        const response = await api.post(`/workouts/${workoutId}/start`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Ends a workout (marks end time and sets as completed)
 * @param workoutId ID of the workout to end
 * @returns Promise with updated workout data
 */
export const endWorkout = async (workoutId: string): Promise<{ message: string; workout: WorkoutBase }> => {
    try {
        const response = await api.post(`/workouts/${workoutId}/end`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Exercise operations
/**
 * Adds a new exercise to a workout
 * @param workoutId ID of the workout
 * @param exerciseData Exercise data to add
 * @returns Promise with created exercise data
 */
export const addExerciseToWorkout = async (
    workoutId: string,
    exerciseData: ExerciseData
): Promise<{ message: string; exercise: Exercise }> => {
    try {
        const response = await api.post(`/workouts/${workoutId}/exercises`, exerciseData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Updates an existing exercise
 * @param exerciseId ID of the exercise to update
 * @param exerciseData Data to update on the exercise
 * @returns Promise with updated exercise data
 */
export const updateExercise = async (
    exerciseId: string,
    exerciseData: Partial<ExerciseData>
): Promise<{ message: string; exercise: Exercise }> => {
    try {
        const response = await api.patch(`/workouts/exercises/${exerciseId}`, exerciseData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Deletes an exercise
 * @param exerciseId ID of the exercise to delete
 * @returns Promise with success message
 */
export const deleteExercise = async (exerciseId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/workouts/exercises/${exerciseId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Superset operations
/**
 * Adds a new superset to a workout
 * @param workoutId ID of the workout
 * @param supersetData Superset data to add
 * @returns Promise with created superset data
 */
export const addSupersetToWorkout = async (
    workoutId: string,
    supersetData: SupersetData
): Promise<{ message: string; superset: Superset }> => {
    try {
        const response = await api.post(`/workouts/${workoutId}/supersets`, supersetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Adds an exercise to an existing superset
 * @param supersetId ID of the superset
 * @param exerciseData Exercise data to add to the superset
 * @returns Promise with created exercise data
 */
export const addExerciseToSuperset = async (
    supersetId: string,
    exerciseData: ExerciseData
): Promise<{ message: string; exercise: Exercise }> => {
    try {
        const response = await api.post(`/workouts/supersets/${supersetId}/exercises`, exerciseData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Updates a superset
 * @param supersetId ID of the superset to update
 * @param supersetData Data to update on the superset
 * @returns Promise with updated superset data
 */
export const updateSuperset = async (
    supersetId: string,
    supersetData: Partial<SupersetData>
): Promise<{ message: string; superset: Superset }> => {
    try {
        const response = await api.patch(`/workouts/supersets/${supersetId}`, supersetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Deletes a superset
 * @param supersetId ID of the superset to delete
 * @returns Promise with success message
 */
export const deleteSuperset = async (supersetId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/workouts/supersets/${supersetId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Removes an exercise from a superset
 * @param supersetId ID of the superset
 * @param exerciseId ID of the exercise to remove
 * @returns Promise with success message
 */
export const removeExerciseFromSuperset = async (
    supersetId: string,
    exerciseId: string
): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/workouts/supersets/${supersetId}/exercises/${exerciseId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Set operations
/**
 * Adds a new set to an exercise
 * @param exerciseId ID of the exercise
 * @param setData Set data to add
 * @returns Promise with created set data
 */
export const addSetToExercise = async (
    exerciseId: string,
    setData: ExerciseSet
): Promise<{ message: string; set: ExerciseSet }> => {
    try {
        const response = await api.post(`/workouts/exercises/${exerciseId}/sets`, setData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Updates an existing set
 * @param setId ID of the set to update
 * @param setData Data to update on the set
 * @returns Promise with updated set data
 */
export const updateSet = async (
    setId: string,
    setData: Partial<ExerciseSet>
): Promise<{ message: string; set: ExerciseSet }> => {
    try {
        const response = await api.patch(`/workouts/sets/${setId}`, setData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Deletes a set
 * @param setId ID of the set to delete
 * @returns Promise with success message
 */
export const deleteSet = async (setId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/workouts/sets/${setId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Dropset operations
/**
 * Adds a dropset to an exercise
 * @param exerciseId ID of the exercise
 * @param dropsetData Dropset data to add
 * @returns Promise with created dropset data
 */
export const addDropsetToExercise = async (
    exerciseId: string,
    dropsetData: Dropset
): Promise<{ message: string; dropset: Dropset }> => {
    try {
        const response = await api.post(`/workouts/exercises/${exerciseId}/dropsets`, dropsetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Updates a dropset
 * @param dropsetId ID of the dropset to update
 * @param dropsetData Data to update on the dropset
 * @returns Promise with updated dropset data
 */
export const updateDropset = async (
    dropsetId: string,
    dropsetData: Partial<Omit<Dropset, 'subSets'>>
): Promise<{ message: string; dropset: Dropset }> => {
    try {
        const response = await api.patch(`/workouts/dropsets/${dropsetId}`, dropsetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Deletes a dropset
 * @param dropsetId ID of the dropset to delete
 * @returns Promise with success message
 */
export const deleteDropset = async (dropsetId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/workouts/dropsets/${dropsetId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Adds a subset to a dropset
 * @param dropsetId ID of the dropset
 * @param subSetData Subset data to add
 * @returns Promise with created subset data
 */
export const addSubSetToDropset = async (
    dropsetId: string,
    subSetData: DropsetSubSet
): Promise<{ message: string; subSet: DropsetSubSet }> => {
    try {
        const response = await api.post(`/workouts/dropsets/${dropsetId}/subsets`, subSetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Updates a subset in a dropset
 * @param subSetId ID of the subset to update
 * @param subSetData Data to update on the subset
 * @returns Promise with updated subset data
 */
export const updateDropsetSubSet = async (
    subSetId: string,
    subSetData: Partial<DropsetSubSet>
): Promise<{ message: string; subSet: DropsetSubSet }> => {
    try {
        const response = await api.patch(`/workouts/subsets/${subSetId}`, subSetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Deletes a subset from a dropset
 * @param subSetId ID of the subset to delete
 * @returns Promise with success message
 */
export const deleteDropsetSubSet = async (subSetId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/workouts/subsets/${subSetId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};