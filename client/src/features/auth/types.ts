import { ReactNode } from 'react';

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

// LoginLayoutProps doesn't need the title because LoginLayout provides it
export interface LoginLayoutProps {
    children: ReactNode;
    className?: string;
}