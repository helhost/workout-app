import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';

// Types
export interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
}

export interface ProfileUser {
    id: string;
    name: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    createdAt: string;
    settings: UserSettings;
    measurements: UserMeasurements;
    hasProfileImage: boolean;
    profileImage?: {
        id: string;
        filename: string;
        mimeType: string;
        size: number;
    };
}

export interface UserSettings {
    darkMode: boolean;
    language: string;
    defaultMeasurementUnit: string;
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

export interface AuthResponse {
    message: string;
    user: ProfileUser;
}

// API functions
export const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
        // Make the API call with explicit content-type and credentials
        const response = await api.post<AuthResponse>('/auth/register', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw handleApiError(error);
    }
};

export const logout = async (): Promise<{ message: string }> => {
    try {
        const response = await api.post<{ message: string }>('/auth/logout');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const getProfile = async (): Promise<{ message: string; profile: ProfileUser }> => {
    try {
        const response = await api.get<{ message: string; profile: ProfileUser }>('/auth/profile');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const refreshToken = async (): Promise<{ message: string }> => {
    try {
        const response = await api.post<{ message: string }>('/auth/refresh');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};