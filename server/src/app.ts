import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import counterRoutes from "./routes/counter";
import authRoutes from "./routes/auth";
import {
    rateLimiter,
    securityMiddleware,
    csrfProtection,
    csrfErrorHandler
} from "./middleware/securityMiddleware";

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);
app.use(securityMiddleware);

// Optional CSRF protection (uncomment if using server-side rendering)
// app.use(csrfProtection);
// app.use(csrfErrorHandler);

// Routes
app.use("/api/counter", counterRoutes);
app.use("/api/auth", authRoutes);

export default app;