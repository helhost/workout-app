import { User } from '@shared';
import { ReactNode } from 'react';

// Type aliases from shared types
export type AuthUser = User.UserFull;
export type UserSettings = User.Settings;
export type MeasurementData = User.MeasurementData;
export type UserMeasurements = User.SimpleMeasurements;
export type ProfileImage = User.ProfileImage;
export type MeasurementHistory = User.Measurements;

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
    user: AuthUser;
}

export interface UserResponse {
    message: string;
    profile: AuthUser;
}

export interface MessageResponse {
    message: string;
}

// Component prop types
export interface LoginFormProps {
    onSubmit: (email: string, password: string, rememberMe: boolean) => void;
    className?: string;
    disabled?: boolean;
}

export interface RegisterFormProps {
    onSubmit: (name: string, email: string, password: string, agreeToTerms: boolean) => void;
    className?: string;
    disabled?: boolean;
}

export interface SocialLoginProps {
    onGoogleLogin: () => void;
    className?: string;
    registerMode?: boolean;
    disabled?: boolean;
}

export interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: ReactNode;
    className?: string;
}

export interface LoginLayoutProps {
    children: ReactNode;
    className?: string;
}