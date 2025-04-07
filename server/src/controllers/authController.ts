import { Request, Response } from 'express';
import { createUser, loginUser } from '../services/authService';
import { generateAccessToken, generateRefreshToken } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, agreeToTerms, ...otherFields } = req.body;

        // Basic validation
        if (!name || !email || !password || !agreeToTerms) {
            res.status(400).json({ error: 'Name, email, password, and agreement to terms are required' });
            return
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return
        }

        // Password strength check (you can enhance this)
        if (password.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters long' });
            return
        }

        // Create user
        const userData = {
            name,
            email,
            password,
            ...otherFields
        };

        const user = await createUser(userData);

        // Generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            name: user.name
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,
            name: user.name
        });

        // Set cookies (same as login)
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth/refresh',
            maxAge: 24 * 60 * 60 * 1000, // 1 day by default for new users
        });

        // Set CSRF token
        res.cookie('XSRF-TOKEN', generateRandomToken(), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Return success with user data
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error: any) {
        if (error.message === 'User already exists') {
            res.status(409).json({ error: 'Email is already registered' });
            return
        }

        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};


// Login controller
export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password, rememberMe = false } = req.body;

        // Basic validation
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return
        }

        // Attempt login
        const user = await loginUser(email, password);

        // Generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            name: user.name
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,
            name: user.name
        });

        // Set access token as HTTP-only cookie
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Set refresh token with longer expiry if "remember me" is checked
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth/refresh',
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 7 days or 1 day
        });

        // Set CSRF token (not HTTP-only so frontend can access it)
        res.cookie('XSRF-TOKEN', generateRandomToken(), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Return user data without tokens
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error: any) {
        // Handle specific error types
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ error: 'Invalid email or password' });
            return
        }

        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// Helper function to generate a random token for CSRF
function generateRandomToken() {
    return require('crypto').randomBytes(32).toString('hex');
}


// Refresh token controller
export const refreshToken = async (req: Request, res: Response) => {
    try {
        // Get the refresh token from cookies
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token not provided' });
            return
        }

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: any, user: any) => {
            if (err) {
                res.status(403).json({ error: 'Invalid refresh token' });
                return
            }

            // Generate new access token
            const accessToken = generateAccessToken({
                id: user.id,
                email: user.email,
                name: user.name
            });

            // Set new access token cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000, // 1 hour
            });

            // Set new CSRF token
            res.cookie('XSRF-TOKEN', generateRandomToken(), {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000, // 1 hour
            });

            res.status(200).json({
                message: 'Token refreshed successfully'
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

export const logout = (req: Request, res: Response) => {
    // Clear all auth cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    res.clearCookie('XSRF-TOKEN');

    res.status(200).json({ message: 'Logged out successfully' });
};