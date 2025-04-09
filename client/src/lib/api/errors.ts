import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
    error: string;
    message?: string;
    details?: any;
}

export class ApiError extends Error {
    status: number;
    data: ApiErrorResponse | null;

    constructor(message: string, status: number = 500, data: ApiErrorResponse | null = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }

    static fromAxiosError(error: AxiosError): ApiError {
        const status = error.response?.status || 500;
        const data = error.response?.data as ApiErrorResponse | undefined;

        // Try to get the most specific error message possible
        const message = data?.message || data?.error || error.message || 'Unknown API error';

        return new ApiError(message, status, data || null);
    }
}

export const handleApiError = (error: unknown): ApiError => {
    if (error instanceof ApiError) {
        return error;
    }

    if (axios.isAxiosError(error)) {
        return ApiError.fromAxiosError(error);
    }

    return new ApiError(error instanceof Error ? error.message : 'Unknown error');
};