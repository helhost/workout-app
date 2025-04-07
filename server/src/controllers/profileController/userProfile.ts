import { Request, Response } from 'express';
import {
    getUserProfileById,
    updateUserName,
    updateUserBio,
    updateUserProfilePicture
} from '../../services/profileService';

// Get user profile with latest measurements
export const getProfile = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const profile = await getUserProfileById(userId);

        res.json({
            message: 'Profile retrieved successfully',
            profile
        });
    } catch (error: any) {
        console.error(error);

        if (error.message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
            return
        }

        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};

// Update user's name
export const updateName = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { name } = req.body;

        if (!name || typeof name !== 'string') {
            res.status(400).json({ error: 'Valid name is required' });
            return
        }

        const updatedUser = await updateUserName(userId, name);

        res.json({
            message: 'Name updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update name' });
    }
};

// Update user's bio
export const updateBio = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { bio } = req.body;

        if (bio === undefined || typeof bio !== 'string') {
            res.status(400).json({ error: 'Valid bio is required' });
            return
        }

        const updatedUser = await updateUserBio(userId, bio);

        res.json({
            message: 'Bio updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update bio' });
    }
};

// Update user's profile picture (legacy URL-based method)
export const updateProfilePicture = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { profilePicture } = req.body;

        if (!profilePicture || typeof profilePicture !== 'string') {
            res.status(400).json({ error: 'Valid profile picture URL is required' });
            return
        }

        const updatedUser = await updateUserProfilePicture(userId, profilePicture);

        res.json({
            message: 'Profile picture updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile picture' });
    }
};