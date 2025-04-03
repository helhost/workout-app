// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface
interface CustomUser {
    id: string;
    email: string;
    name: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: CustomUser;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Get token from cookies instead of headers
    const token = req.cookies.access_token;

    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return
    }

    // Temporarily disable CSRF check for testing purposes
    /* 
    // Verify CSRF token for non-GET requests
    if (req.method !== 'GET') {
        const csrfToken = req.headers['x-xsrf-token'];
        const expectedCsrfToken = req.cookies['XSRF-TOKEN'];

        if (!csrfToken || csrfToken !== expectedCsrfToken) {
            res.status(403).json({ error: 'CSRF token validation failed' });
            return
        }
    }
    */

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ error: 'Invalid token' });
            return
        }

        req.user = user;
        next();
    });
};

export const generateAccessToken = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: any) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};