import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as authApi from './api';
import { User } from './api';
import { ApiError } from '@/lib/api/errors';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already logged in
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsLoading(true);

                // Check if we're on a public route (login or register)
                const isPublicRoute = window.location.pathname === '/login' ||
                    window.location.pathname === '/register';

                // Skip profile check if we're on a public route
                if (!isPublicRoute) {
                    try {
                        const { profile } = await authApi.getProfile();
                        setUser(profile);
                    } catch (err) {
                        // User is not authenticated, that's okay for public routes
                        console.log('User not authenticated');
                        setUser(null);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string, rememberMe = false) => {
        try {
            setIsLoading(true);
            setError(null);
            const { user } = await authApi.login({ email, password, rememberMe });
            setUser(user);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
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
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authApi.logout();
            setUser(null);
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