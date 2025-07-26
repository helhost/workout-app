import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';
import { User } from '@shared';

/**
 * Updates the name of the authenticated user
 * @param name New name to set
 * @returns Updated user data with new name
 * @throws {ApiError} If update fails or user is not authenticated
 */
export const updateName = async (name: string): Promise<{
    message: string;
    user: { id: string; name: string }
}> => {
    try {
        const response = await api.patch<{
            message: string;
            user: { id: string; name: string }
        }>('/user/name', { name });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Updates the bio of the authenticated user
 * @param bio New bio text to set
 * @returns Updated user data with new bio
 * @throws {ApiError} If update fails or user is not authenticated
 */
export const updateBio = async (bio: string): Promise<{
    message: string;
    user: { id: string; bio: string }
}> => {
    try {
        const response = await api.patch<{
            message: string;
            user: { id: string; bio: string }
        }>('/user/bio', { bio });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Include the previously defined functions
/**
 * Uploads a new profile image for the authenticated user
 * @param file Image file to upload
 * @returns Uploaded profile image metadata
 * @throws {ApiError} If upload fails or user is not authenticated
 */
export const uploadProfileImage = async (file: File): Promise<{
    message: string;
    profileImage: User.ProfileImage
}> => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post<{
            message: string;
            profileImage: User.ProfileImage
        }>('/user/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Deletes the authenticated user's profile image
 * @returns Confirmation message
 * @throws {ApiError} If deletion fails or user is not authenticated
 */
export const deleteProfileImage = async (): Promise<{
    message: string
}> => {
    try {
        const response = await api.delete<{ message: string }>('/user/image');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Retrieves metadata for the authenticated user's profile image
 * @returns Profile image metadata without binary data
 * @throws {ApiError} If retrieval fails or user is not authenticated
 */
export const getProfileImageMetadata = async (): Promise<{
    message: string;
    profileImage: Omit<User.ProfileImage, 'data'>
}> => {
    try {
        const response = await api.get<{
            message: string;
            profileImage: Omit<User.ProfileImage, 'data'>
        }>('/user/image/metadata');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Retrieves the profile image as a blob URL that can be used directly in an img tag
 * @returns Promise with object URL for the profile image
 * @throws Error if the image cannot be retrieved
 */
export const getProfileImageAsBlob = async (): Promise<string> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/user/image?t=${Date.now()}`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch profile image');

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Failed to get profile image as blob:', error);
        throw error;
    }
};

/**
 * Retrieves the latest body measurements for the authenticated user
 * @returns Latest measurements across weight, height, and body fat
 * @throws {ApiError} If retrieval fails or user is not authenticated
 */
export const getLatestMeasurements = async (): Promise<{
    message: string;
    measurements: User.SimpleMeasurements
}> => {
    try {
        const response = await api.get<{
            message: string;
            measurements: User.SimpleMeasurements
        }>('/user/measurements/latest');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Retrieves the measurement history for the authenticated user
 * @returns Measurement history for weight, height, and body fat
 * @throws {ApiError} If retrieval fails or user is not authenticated
 */
export const getMeasurementHistory = async (): Promise<{
    message: string;
    history: User.Measurements
}> => {
    try {
        const response = await api.get<{
            message: string;
            history: User.Measurements
        }>('/user/measurements/history');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Adds a new weight measurement for the authenticated user
 * @param value Weight measurement value (in kg)
 * @returns Created weight measurement data
 * @throws {ApiError} If adding measurement fails or user is not authenticated
 */
export const addWeightMeasurement = async (value: number): Promise<{
    message: string;
    measurement: User.MeasurementData
}> => {
    try {
        const response = await api.post<{
            message: string;
            measurement: User.MeasurementData
        }>('/user/measurements/weight', { value });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Adds a new height measurement for the authenticated user
 * @param value Height measurement value (in cm)
 * @returns Created height measurement data
 * @throws {ApiError} If adding measurement fails or user is not authenticated
 */
export const addHeightMeasurement = async (value: number): Promise<{
    message: string;
    measurement: User.MeasurementData
}> => {
    try {
        const response = await api.post<{
            message: string;
            measurement: User.MeasurementData
        }>('/user/measurements/height', { value });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Adds a new body fat percentage measurement for the authenticated user
 * @param value Body fat percentage value (0-100)
 * @returns Created body fat measurement data
 * @throws {ApiError} If adding measurement fails or user is not authenticated
 */
export const addBodyFatMeasurement = async (value: number): Promise<{
    message: string;
    measurement: User.MeasurementData
}> => {
    try {
        const response = await api.post<{
            message: string;
            measurement: User.MeasurementData
        }>('/user/measurements/body-fat', { value });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};