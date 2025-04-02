import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
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