import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import userRotues from "./routes/user";
import workoutRoutes from "./routes/workouts";
import {
    rateLimiter,
    securityMiddleware,
    csrfProtection,
    csrfErrorHandler
} from "./middleware/securityMiddleware";

const app = express();

// Read allowed origins from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// CORS Configuration
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`Origin ${origin} not allowed by CORS`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN', 'x-xsrf-token'],
    exposedHeaders: ['X-XSRF-TOKEN', 'x-xsrf-token'],
    optionsSuccessStatus: 200
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);
app.use(securityMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRotues);
app.use("/api/workouts", workoutRoutes);

export default app;