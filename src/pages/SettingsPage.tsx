import ThemeToggle from "@/features/theme/themeToggle"

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Appearance</h2>

                <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Theme</span>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )
}