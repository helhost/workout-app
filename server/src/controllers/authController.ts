import { register, login } from '../services/authService';
import { getUserById } from '../services/userService';
import { generateAccessToken, generateRefreshToken } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import { Controller } from '../types';

/**
 * Handles user registration
 * @param req Express request object containing user registration data
 * @param res Express response object
 * @returns HTTP response with user data or error message
 */
export const handleRegister: Controller = async (req, res) => {
    try {
        const { name, email, password, agreeToTerms } = req.body;

        // Basic validation
        if (!name || !email || !password || !agreeToTerms) {
            res.status(400).json({ error: 'Name, email, password, and agreement to terms are required' });
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        // Password strength check (you can enhance this)
        if (password.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters long' });
            return;
        }

        const { id } = await register(name, email, password);

        const user = await getUserById(id);

        // Set authentication tokens and cookies
        setAuthTokensAndCookies(res, user);

        // Return success with user data
        res.status(201).json({
            message: 'User registered successfully',
            user: user
        });
    } catch (error: any) {
        if (error.message === 'User already exists') {
            res.status(409).json({ error: 'Email is already registered' });
            return;
        }

        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * Handles user login
 * @param req Express request object containing login credentials
 * @param res Express response object
 * @returns HTTP response with user profile data or error message
 */
export const handleLogin: Controller = async (req, res) => {
    try {
        const { email, password, rememberMe = false } = req.body;

        // Basic validation
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        // Attempt login (now only returns ID)
        const { id } = await login(email, password);

        // Get full user profile
        const userProfile = await getUserById(id);

        // Set authentication tokens and cookies, passing the rememberMe flag
        setAuthTokensAndCookies(res, userProfile, rememberMe);

        // Return the complete user profile
        res.status(200).json({
            message: 'Login successful',
            user: userProfile
        });
    } catch (error: any) {
        // Handle specific error types
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        } else if (error.message === 'User not found') {
            res.status(404).json({ error: 'User account not found' });
            return;
        }

        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Refreshes the user's access token using their refresh token
 * @param req Express request object containing the refresh token in cookies
 * @param res Express response object
 * @returns HTTP response with success message or error
 */
export const handleRefreshToken: Controller = async (req, res) => {
    try {
        // Get the refresh token from cookies
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token not provided' });
            return;
        }

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: any, user: any) => {
            if (err) {
                res.status(403).json({ error: 'Invalid refresh token' });
                return;
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

/**
 * Logs out the user by clearing all authentication cookies
 * @param req Express request object
 * @param res Express response object
 * @returns HTTP response with success message
 */
export const handleLogout: Controller = (req, res) => {
    // Clear all auth cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    res.clearCookie('XSRF-TOKEN');

    res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Generates a random token for CSRF protection
 * @returns Random hexadecimal string
 */
function generateRandomToken() {
    return require('crypto').randomBytes(32).toString('hex');
}

/**
 * Sets authentication tokens and cookies for a user
 * @param res Express response object
 * @param user User data to use for token generation
 * @param rememberMe Whether to extend refresh token expiry (optional)
 */
const setAuthTokensAndCookies = (res: any, user: { id: string; email: string; name: string }, rememberMe = false) => {
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

    return { accessToken, refreshToken };
};