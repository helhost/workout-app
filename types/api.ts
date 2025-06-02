export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
}

export interface ApiPaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        offset: number;
        limit: number;
    };
    message?: string;
}