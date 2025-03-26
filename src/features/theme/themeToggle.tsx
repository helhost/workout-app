import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { setDarkMode, isDarkModeEnabled } from "@/features/theme/themeUtils"

interface ThemeToggleProps {
    className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
    const [darkMode, setDarkModeState] = useState(false)

    useEffect(() => {
        // Initialize from current document state
        setDarkModeState(isDarkModeEnabled())
    }, [])

    const toggleDarkMode = () => {
        const newMode = !darkMode
        setDarkModeState(newMode)
        setDarkMode(newMode)
    }

    return (
        <Button onClick={toggleDarkMode} className={className}>
            Toggle {darkMode ? "Light" : "Dark"} Mode
        </Button>
    )
}