import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (_req, res) => {
    const counter = await prisma.counter.findFirst()
    res.json({ value: counter?.value ?? 0 })
})

router.post("/", async (req, res) => {
    const { value } = req.body
    let counter = await prisma.counter.findFirst()

    if (counter) {
        counter = await prisma.counter.update({
            where: { id: counter.id },
            data: { value }
        })
    } else {
        counter = await prisma.counter.create({ data: { value } })
    }

    res.json({ value: counter.value })
})

export default router
