import { Routes, Route } from "react-router-dom"
import NavigationBar from "@/components/layout/navigationBar"
import HomePage from "@/pages/HomePage"
import StatsPage from "@/pages/StatsPage"
import SettingsPage from "@/pages/SettingsPage"

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<NavigationBar />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    )
}