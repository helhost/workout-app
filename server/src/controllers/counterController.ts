import { Request, Response } from "express"
import { incrementCounterValue, getCurrentCounter } from "../services/counterService"

export const getCounter = async (_req: Request, res: Response) => {
    try {
        const counter = await getCurrentCounter()
        res.json({ value: counter })
    } catch (error) {
        res.status(500).json({ error: "Failed to get counter" })
    }
}

export const incrementCounter = async (req: Request, res: Response) => {
    try {
        const { value } = req.body

        // Basic validation
        if (value === undefined || typeof value !== 'number') {
            res.status(400).json({
                error: "Invalid input. Value must be a number."
            })
            return
        }

        const updatedCounter = await incrementCounterValue(value)
        res.json({ value: updatedCounter })
    } catch (error) {
        res.status(500).json({ error: "Failed to update counter" })
    }
}