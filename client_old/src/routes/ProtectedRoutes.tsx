import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/authContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    // If auth is still loading, you could show a loading spinner
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If user is authenticated, render the children
    return <>{children}</>;
}