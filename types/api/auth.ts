// Auth related API types
import { Models } from '..';

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
        user: Models.User.User;
    }

    export interface LogoutResponse {
        message: string;
    }

    export interface RefreshTokenResponse {
        message: string;
    }

    export interface ProfileResponse {
        message: string;
        profile: Models.User.User;
    }
}