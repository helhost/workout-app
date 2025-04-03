import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import csurf from 'csurf';
import { Request, Response, NextFunction } from 'express';

// Rate limiting middleware
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100000, // limit each IP to 100000 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

// Security headers middleware
export const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
});

// CSRF protection middleware (for server-rendered apps)
export const csrfProtection = csurf({ cookie: true });

// Custom CSRF error handler
export const csrfErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // Handle CSRF token errors
    res.status(403).json({
        error: 'Form tampered with or CSRF token invalid'
    });
};