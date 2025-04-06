import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';

// Types
export interface ProfileUser {
    id: string;
    name: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    createdAt: string;
    settings: UserSettings;
    measurements: UserMeasurements;
}

export interface UserSettings {
    language: string;
    darkMode: boolean;
    highContrast: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationSound: boolean;
}

export interface UserMeasurements {
    weight: MeasurementData | null;
    height: MeasurementData | null;
    bodyFat: MeasurementData | null;
}

export interface MeasurementData {
    value: number;
    date: string;
}

export interface MeasurementHistory {
    id: string;
    value: number;
    date: string;
}

// API functions for profile data
export const getProfile = async (): Promise<{ message: string; profile: ProfileUser }> => {
    try {
        const response = await api.get<{ message: string; profile: ProfileUser }>('/profile');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateName = async (name: string): Promise<{ message: string; user: { id: string; name: string } }> => {
    try {
        const response = await api.patch<{ message: string; user: { id: string; name: string } }>('/profile/name', { name });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateBio = async (bio: string): Promise<{ message: string; user: { id: string; bio: string } }> => {
    try {
        const response = await api.patch<{ message: string; user: { id: string; bio: string } }>('/profile/bio', { bio });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateProfilePicture = async (profilePicture: string): Promise<{
    message: string;
    user: { id: string; profilePicture: string }
}> => {
    try {
        const response = await api.patch<{
            message: string;
            user: { id: string; profilePicture: string }
        }>('/profile/profile-picture', { profilePicture });
        return response.data;
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