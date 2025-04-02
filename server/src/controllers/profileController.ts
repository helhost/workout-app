import { Request, Response } from 'express';
import { getUserProfileById } from '../services/profileService';

export const getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        // For now, we'll use a hardcoded user ID. Later, we'll use authentication
        const userId = req.params.id;

        const profile = await getUserProfileById(userId);

        res.json({
            message: 'Profile retrieved successfully',
            profile
        });
    } catch (error: any) {
        console.error(error);

        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};