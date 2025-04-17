import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as authApi from './api';
import { ApiError } from '@/lib/api/errors';
import { AuthUser } from '@/types/auth';
const { setDarkMode } = await import('@/features/theme/themeUtils');

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string, rememberMe?: boolean, onSuccess?: () => void) => Promise<void>;
    register: (name: string, email: string, password: string, onSuccess?: () => void) => Promise<void>;
    logout: (onSuccess?: () => void) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already logged in
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);

            // Check if we're on a public route (login or register)
            const isPublicRoute = window.location.pathname === '/login' ||
                window.location.pathname === '/register';

            // Skip profile check if we're on a public route
            if (!isPublicRoute) {
                try {
                    const { profile } = await authApi.getUser();
                    setUser(profile);

                    // Apply dark mode setting if it exists in the profile
                    if (profile.settings && profile.settings.darkMode !== undefined) {
                        setDarkMode(profile.settings.darkMode);
                    }
                } catch (err) {
                    // User is not authenticated, that's okay for public routes
                    setUser(null);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string, rememberMe = false, onSuccess?: () => void) => {
        try {
            setIsLoading(true);
            setError(null);
            const { user } = await authApi.login({ email, password, rememberMe });
            setUser(user);
            if (onSuccess) {
                onSuccess();
            }
            checkAuthStatus(); // Refresh user profile after login
        } catch (err) {
            console.error("Login error in auth context:", err);
            const apiError = err as ApiError;
            const errorMessage = apiError.message || "Authentication failed";
            setError(errorMessage);
            throw err; // Still throw so LoginPage can handle it
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, onSuccess?: () => void) => {
        try {
            setIsLoading(true);
            setError(null);
            const { user } = await authApi.register({
                name,
                email,
                password,
                agreeToTerms: true
            });
            setUser(user);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (onSuccess?: () => void) => {
        try {
            setIsLoading(true);
            await authApi.logout();
            setUser(null);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};