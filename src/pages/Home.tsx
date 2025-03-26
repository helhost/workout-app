import CounterButton from "@/features/counter/components/CounterButton"
import ThemeToggle from "@/features/theme/ThemeToggle"

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-svh bg-white dark:bg-gray-900 text-black dark:text-white">
            <CounterButton />
            <ThemeToggle className="mt-4" />
        </div>
    )
}