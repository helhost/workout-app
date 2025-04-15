export * from './auth';
export * from './user';
export * from './workout';

// Common API response types
export namespace API {
    export interface PaginationParams {
        limit?: number;
        offset?: number;
    }

    export interface PaginationMeta {
        total: number;
        offset: number;
        limit: number;
    }

    export interface ErrorResponse {
        error: string;
        message?: string;
        details?: any;
    }
}