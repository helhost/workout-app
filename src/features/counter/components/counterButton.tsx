import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getCounter, updateCounter } from "@/features/counter/counterApi"
interface CounterButtonProps {
    className?: string
}

export default function CounterButton({ className }: CounterButtonProps) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        getCounter().then(setCount)
    }, [])

    const handleClick = async () => {
        const newCount = count + 1
        setCount(newCount)
        await updateCounter(newCount)
    }

    return (
        <div className={className}>
            <Button onClick={handleClick}>Click me</Button>
            <p className="text-2xl mt-4">You clicked {count} times</p>
        </div>
    )
}