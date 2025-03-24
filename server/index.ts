import express from "express"
import cors from "cors"
import counterRoutes from "./routes/counter"

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use("/api/counter", counterRoutes)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
