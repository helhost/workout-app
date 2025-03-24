import { Button } from "@/components/ui/button"
import { useState } from "react"

function App() {

  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
      <p className="text-2xl mt-4">You clicked {count} times</p>
    </div>
  )
}

export default App
