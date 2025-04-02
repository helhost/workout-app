import { Request, Response } from 'express';
import { getUserProfileById } from '../services/profileService';

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