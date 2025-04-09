import { Request, Response } from 'express';
import { updateUserSettings } from '../../services/profileService';

export const updateSettings = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const { settings } = req.body;

        if (!settings || typeof settings !== 'object') {
            res.status(400).json({ error: 'Valid settings object is required' });
            return;
        }

        // Update the settings
        const updatedSettings = await updateUserSettings(userId, settings);

        res.json({
            message: 'Settings updated successfully',
            settings: updatedSettings
        });
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};