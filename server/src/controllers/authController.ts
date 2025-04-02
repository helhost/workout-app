import { Request, Response } from 'express';
import { createUser } from '../services/authService';
import { generateAccessToken } from '../middleware/authMiddleware';

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            email,
            password,
            name,
            phone,
            address,
            occupation,
            birthday,
            website,
            bio
        } = req.body;

        // Basic validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, name, and password are required' });
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Password strength check
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Optional: Additional field validations can be added here
        // For example, checking phone number format, birthday validity, etc.

        // Prepare user data
        const userData = {
            email,
            password,
            name,
            phone,
            address,
            occupation,
            birthday: birthday ? new Date(birthday) : undefined,
            website,
            bio
        };

        // Create user
        const user = await createUser(userData);

        // Generate access token
        const token = generateAccessToken({
            id: user.id,
            email: user.email,
            name: user.name
        });

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    } catch (error: any) {
        // Handle specific error types
        if (error.message === 'User already exists') {
            return res.status(409).json({ error: 'User already exists' });
        }

        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};