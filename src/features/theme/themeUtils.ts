export function setDarkMode(isDark: boolean): void {
    const root = window.document.documentElement
    isDark ? root.classList.add("dark") : root.classList.remove("dark")
}

export function isDarkModeEnabled(): boolean {
    const root = window.document.documentElement
    return root.classList.contains("dark")
}