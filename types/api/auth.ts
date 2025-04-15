// Auth related API types
import { UserModels } from '../models/user';

export namespace AuthAPI {
    // Request types
    export interface LoginRequest {
        email: string;
        password: string;
        rememberMe?: boolean;
    }

    export interface RegisterRequest {
        name: string;
        email: string;
        password: string;
        agreeToTerms: boolean;
    }

    // Response types
    export interface AuthResponse {
        message: string;
        user: UserModels.User;
    }

    export interface LogoutResponse {
        message: string;
    }

    export interface RefreshTokenResponse {
        message: string;
    }

    export interface ProfileResponse {
        message: string;
        profile: UserModels.User;
    }
}