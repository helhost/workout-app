import { Routes, Route, Navigate } from "react-router-dom"
import { NavigationBar } from "@/features/navigation"
import HomePage from "@/pages/HomePage"
import StatsPage from "@/pages/StatsPage"
import SettingsPage from "@/pages/SettingsPage"
import ProfilePage from "@/pages/ProfilePage"
import WorkoutsPage from "@/pages/WorkoutsPage"
import WorkoutDetailPage from "@/pages/WorkoutDetailPage"
import WorkoutFormPage from "@/pages/WorkoutFormPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ProtectedRoute from "./ProtectedRoutes"

export default function AppRoutes() {
    return (
        <Routes>
            {/* Auth routes without navigation bar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Routes with navigation bar */}
            <Route element={<NavigationBar />}>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />

                {/* Protected routes */}
                <Route
                    path="/stats"
                    element={
                        <ProtectedRoute>
                            <StatsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workouts"
                    element={
                        <ProtectedRoute>
                            <WorkoutsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workouts/new"
                    element={
                        <ProtectedRoute>
                            <WorkoutFormPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workouts/:workoutId"
                    element={
                        <ProtectedRoute>
                            <WorkoutDetailPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workouts/:workoutId/edit"
                    element={
                        <ProtectedRoute>
                            <WorkoutFormPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    )
}