import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';
import { ProfileUser, UserMeasurements, MeasurementHistory } from '@/features/auth/api'

// get profile
export const getProfile = async (): Promise<{ message: string; profile: ProfileUser }> => {
    try {
        const response = await api.get<{ message: string; profile: ProfileUser }>('/profile');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Update name
export const updateName = async (name: string): Promise<{ message: string; user: { id: string; name: string } }> => {
    try {
        const response = await api.patch<{ message: string; user: { id: string; name: string } }>('/profile/name', { name });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Udpate Bio
export const updateBio = async (bio: string): Promise<{ message: string; user: { id: string; bio: string } }> => {
    try {
        const response = await api.patch<{ message: string; user: { id: string; bio: string } }>('/profile/bio', { bio });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Upload profile image
export const uploadProfileImage = async (file: File): Promise<{ message: string; image: any }> => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post<{ message: string; image: any }>('/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Delete profile image
export const deleteProfileImage = async (): Promise<{ message: string }> => {
    try {
        const response = await api.delete<{ message: string }>('/profile/image');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const getProfileImageUrl = async (forceRefresh = false): Promise<string> => {
    try {
        // Add a timestamp query parameter to bust cache if needed
        const timestamp = forceRefresh ? new Date().getTime() : '';
        const response = await api.get(`/profile/image${forceRefresh ? `?t=${timestamp}` : ''}`, {
            responseType: 'blob',
        });

        // Convert blob to an object URL
        return URL.createObjectURL(response.data);
    } catch (error) {
        throw handleApiError(error);
    }
};

// API functions for measurements
export const getLatestMeasurements = async (): Promise<{
    message: string;
    measurements: UserMeasurements
}> => {
    try {
        const response = await api.get<{ message: string; measurements: UserMeasurements }>('/profile/measurements/latest');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const getMeasurementHistory = async (
    type: 'weight' | 'height' | 'bodyFat',
    limit?: number
): Promise<{
    message: string;
    history: MeasurementHistory[]
}> => {
    try {
        const params = limit ? { params: { limit } } : {};
        const response = await api.get<{
            message: string;
            history: MeasurementHistory[]
        }>(`/profile/measurements/${type}/history`, params);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const addWeightMeasurement = async (
    value: number,
    date?: Date
): Promise<{
    message: string;
    measurement: MeasurementHistory
}> => {
    try {
        const response = await api.post<{
            message: string;
            measurement: MeasurementHistory
        }>('/profile/measurements/weight', { value, date: date?.toISOString() });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const addHeightMeasurement = async (
    value: number,
    date?: Date
): Promise<{
    message: string;
    measurement: MeasurementHistory
}> => {
    try {
        const response = await api.post<{
            message: string;
            measurement: MeasurementHistory
        }>('/profile/measurements/height', { value, date: date?.toISOString() });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const addBodyFatMeasurement = async (
    value: number,
    date?: Date
): Promise<{
    message: string;
    measurement: MeasurementHistory
}> => {
    try {
        const response = await api.post<{
            message: string;
            measurement: MeasurementHistory
        }>('/profile/measurements/body-fat', { value, date: date?.toISOString() });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};