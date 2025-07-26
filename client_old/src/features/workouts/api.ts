import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';

// Get all workouts
export const getWorkouts = async (params: {
    limit?: number;
    offset?: number;
    completed?: boolean;
    startDate?: Date;
    endDate?: Date;
} = {}) => {
    try {
        // Convert params to URL query parameters
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());
        if (params.completed !== undefined) queryParams.append('completed', params.completed.toString());
        if (params.startDate) queryParams.append('startDate', params.startDate.toISOString());
        if (params.endDate) queryParams.append('endDate', params.endDate.toISOString());

        const response = await api.get(`/workouts?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Get a single workout by ID
export const getWorkoutById = async (workoutId: string) => {
    try {
        const response = await api.get(`/workouts/${workoutId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Create a new workout
export const createWorkout = async (workoutData: any) => {
    try {
        const response = await api.post('/workouts', workoutData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Update an existing workout
export const updateWorkout = async (workoutId: string, workoutData: any) => {
    try {
        const response = await api.patch(`/workouts/${workoutId}`, workoutData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Delete a workout
export const deleteWorkout = async (workoutId: string) => {
    try {
        const response = await api.delete(`/workouts/${workoutId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Start a workout (set the startTime)
export const startWorkout = async (workoutId: string) => {
    try {
        const response = await api.post(`/workouts/${workoutId}/start`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// End a workout (set the endTime and mark as completed)
export const endWorkout = async (workoutId: string) => {
    try {
        const response = await api.post(`/workouts/${workoutId}/end`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Exercise operations
export const addExerciseToWorkout = async (workoutId: string, exerciseData: any) => {
    try {
        const response = await api.post(`/workouts/${workoutId}/exercises`, exerciseData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateExercise = async (exerciseId: string, exerciseData: any) => {
    try {
        const response = await api.patch(`/workouts/exercises/${exerciseId}`, exerciseData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deleteExercise = async (exerciseId: string) => {
    try {
        const response = await api.delete(`/workouts/exercises/${exerciseId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Superset operations
export const addSupersetToWorkout = async (workoutId: string, supersetData: any) => {
    try {
        const response = await api.post(`/workouts/${workoutId}/supersets`, supersetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const addExerciseToSuperset = async (supersetId: string, exerciseData: any) => {
    try {
        const response = await api.post(`/workouts/supersets/${supersetId}/exercises`, exerciseData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateSuperset = async (supersetId: string, supersetData: any) => {
    try {
        const response = await api.patch(`/workouts/supersets/${supersetId}`, supersetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deleteSuperset = async (supersetId: string) => {
    try {
        const response = await api.delete(`/workouts/supersets/${supersetId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Set operations
export const addSetToExercise = async (exerciseId: string, setData: any) => {
    try {
        const response = await api.post(`/workouts/exercises/${exerciseId}/sets`, setData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateSet = async (setId: string, setData: any) => {
    try {
        const response = await api.patch(`/workouts/sets/${setId}`, setData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deleteSet = async (setId: string) => {
    try {
        const response = await api.delete(`/workouts/sets/${setId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Subset operations for drop sets
export const addSubSetToSet = async (setId: string, subSetData: any) => {
    try {
        const response = await api.post(`/workouts/sets/${setId}/subsets`, subSetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateSubSet = async (subSetId: string, subSetData: any) => {
    try {
        const response = await api.patch(`/workouts/subsets/${subSetId}`, subSetData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deleteSubSet = async (subSetId: string) => {
    try {
        const response = await api.delete(`/workouts/subsets/${subSetId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};