import { Routes, Route } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout"
import HomePage from "@/pages/HomePage"
import StatsPage from "@/pages/StatsPage"
import SettingsPage from "@/pages/SettingsPage"

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    )
}