import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getCounter, updateCounter } from "@/features/counter/api/counterAPI"

function App() {
    const [count, setCount] = useState(0)
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const root = window.document.documentElement
        darkMode ? root.classList.add("dark") : root.classList.remove("dark")
    }, [darkMode])

    useEffect(() => {
        getCounter().then(setCount)
    }, [])

    const handleClick = async () => {
        const newCount = count + 1
        setCount(newCount)
        await updateCounter(newCount)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-svh bg-white dark:bg-gray-900 text-black dark:text-white">
            <Button onClick={handleClick}>Click me</Button>
            <p className="text-2xl mt-4">You clicked {count} times</p>
            <Button onClick={() => setDarkMode(!darkMode)} className="mt-4">
                Toggle Dark Mode
            </Button>
        </div>
    )
}

export default App
