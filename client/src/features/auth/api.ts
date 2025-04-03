// In client/src/features/auth/api.ts

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

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    user: User;
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
        // Add debugging logs
        console.log('Register request data:', { ...data, password: '[REDACTED]' });

        // Make the API call with explicit content-type and credentials
        const response = await api.post<AuthResponse>('/auth/register', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        console.log('Register response:', response.data);
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

export const getProfile = async (): Promise<{ message: string; profile: User }> => {
    try {
        const response = await api.get<{ message: string; profile: User }>('/auth/profile');
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