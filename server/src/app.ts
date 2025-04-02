import express from "express";
import cors from "cors";
import counterRoutes from "./routes/counter";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/counter", counterRoutes);

export default app;