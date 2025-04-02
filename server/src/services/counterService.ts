import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// getCurrentCounter function
export const getCurrentCounter = async () => {
    const counter = await prisma.counter.findFirst()
    return counter?.value ?? 0
}

// incrementCounterValue function
export const incrementCounterValue = async (value: number) => {
    let counter = await prisma.counter.findFirst()

    if (counter) {
        counter = await prisma.counter.update({
            where: { id: counter.id },
            data: { value }
        })
    } else {
        counter = await prisma.counter.create({ data: { value } })
    }

    return counter.value
}