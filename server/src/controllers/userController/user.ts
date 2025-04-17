import {
    getUserById,
    updateUsername,
    updateBio,
    updateSettings
} from '@/services/userService';
import { Controller } from 'types';

/**
 * Retrieves the profile information of the authenticated user
 * @param req Express request object containing authenticated user details
 * @param res Express response object to send back the profile data
 * @returns Profile information with latest measurements if successful
 * @throws 401 if user is not authenticated
 * @throws 404 if user is not found
 * @throws 500 if server encounters an error
 */
export const handleGetUserById: Controller = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const profile = await getUserById(userId);

        res.status(200).json({
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

/**
 * Updates the name of the authenticated user
 * @param req Express request object with user ID and new name in body
 * @param res Express response object
 * @returns Updated user information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if name is missing or invalid
 * @throws 500 if update operation fails
 */
export const handleUpdateUsername: Controller = async (req, res) => {
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

        const updatedUser = await updateUsername(userId, name);

        res.status(200).json({
            message: 'Name updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update name' });
    }
};

/**
 * Updates the bio information of the authenticated user
 * @param req Express request object with user ID and new bio in body
 * @param res Express response object
 * @returns Updated user information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if bio is undefined or invalid
 * @throws 500 if update operation fails
 */
export const handleUpdateBio: Controller = async (req, res) => {
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

        const updatedUser = await updateBio(userId, bio);

        res.status(200).json({
            message: 'Bio updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update bio' });
    }
};

/**
 * Updates user settings for the authenticated user
 * @param req Express request object with user ID and settings object
 * @param res Express response object
 * @returns Updated settings if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if settings object is missing or invalid
 * @throws 500 if settings update fails
 */
export const handleUpdateSettings: Controller = async (req, res) => {
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
        const updatedSettings = await updateSettings(userId, settings);

        res.status(200).json({
            message: 'Settings updated successfully',
            settings: updatedSettings
        });
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};