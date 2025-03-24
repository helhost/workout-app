import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

function App() {
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-white dark:bg-gray-900 text-black dark:text-white">
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
      <p className="text-2xl mt-4">You clicked {count} times</p>
      <Button onClick={() => setDarkMode(!darkMode)} className="mt-4">
        Toggle Dark Mode
      </Button>
    </div>
  )
}

export default App
