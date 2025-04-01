import { Routes, Route } from "react-router-dom"
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

export default function AppRoutes() {
    return (
        <Routes>
            {/* Auth routes without navigation bar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with navigation bar */}
            <Route element={<NavigationBar />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/workouts" element={<WorkoutsPage />} />
                <Route path="/workouts/new" element={<WorkoutFormPage />} />
                <Route path="/workouts/:workoutId" element={<WorkoutDetailPage />} />
                <Route path="/workouts/:workoutId/edit" element={<WorkoutFormPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>
        </Routes>
    )
}