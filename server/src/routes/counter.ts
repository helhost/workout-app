import express from "express"
import { incrementCounter, getCounter } from "../controllers/counterController"

const router = express.Router()

router.get("/", getCounter)
router.post("/", incrementCounter)

export default router