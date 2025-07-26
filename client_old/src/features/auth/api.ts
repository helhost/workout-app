import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';
import {
    AuthUser,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    UserResponse,
    MessageResponse
} from '@/types/auth';

/**
 * Logs in a user with email, password, and optional remember me flag
 * @param data Login credentials
 * @returns User data and message from the API
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Registers a new user
 * @param data Registration details
 * @returns User data and message from the API
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
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

/**
 * Logs out the current user by clearing session data
 * @returns Confirmation message
 */
export const logout = async (): Promise<MessageResponse> => {
    try {
        const response = await api.post<MessageResponse>('/auth/logout');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Retrieves the current authenticated user's data
 * @returns User profile data
 */
export const getUser = async (): Promise<UserResponse> => {
    try {
        const response = await api.get<UserResponse>('/user');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Refreshes the authentication token using the refresh token
 * @returns Confirmation message
 */
export const refreshToken = async (): Promise<MessageResponse> => {
    try {
        const response = await api.post<MessageResponse>('/auth/refresh');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Re-export the AuthUser type for convenience
export type { AuthUser };