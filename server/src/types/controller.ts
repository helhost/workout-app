import { Request, Response } from 'express';
import { ApiResponse, ApiErrorResponse, ApiPaginatedResponse } from '@shared';

export type Controller<TResponse = any> = (
    req: Request,
    res: Response<ApiResponse<TResponse> | ApiErrorResponse | ApiPaginatedResponse<TResponse>>
) => Promise<void> | void;