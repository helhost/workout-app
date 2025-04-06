import { Request, Response } from 'express';
import multer from 'multer';
import {
    getUserProfileById,
    updateUserName,
    updateUserBio,
    updateUserProfilePicture,
    getLatestMeasurements,
    getMeasurementHistory,
    addWeightMeasurement,
    addHeightMeasurement,
    addBodyFatMeasurement,
    saveProfileImage,
    getProfileImageData,
    deleteProfileImage
} from '../services/profileService';

// Set up multer for memory storage
const storage = multer.memoryStorage();
// Set up file filter to only allow images
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

// Configure multer upload
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: fileFilter
});

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

// Upload profile image (uses multer middleware in route)
export const uploadProfileImage = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;

        // Check if file was uploaded
        if (!req.file) {
            res.status(400).json({ error: 'No image file provided' });
            return;
        }

        // Save the profile image
        const savedImage = await saveProfileImage(userId, {
            filename: req.file.originalname,
            data: req.file.buffer,
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        res.status(201).json({
            message: 'Profile image uploaded successfully',
            image: {
                id: savedImage.id,
                filename: savedImage.filename,
                mimeType: savedImage.mimeType,
                size: savedImage.size
            }
        });
    } catch (error) {
        console.error('Upload profile image error:', error);
        res.status(500).json({ error: 'Failed to upload profile image' });
    }
};

// Get profile image
export const getProfileImage = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.params.userId || req.user.id;

        try {
            const imageData = await getProfileImageData(userId);

            // Set appropriate headers
            res.set('Content-Type', imageData.mimeType);
            res.set('Content-Disposition', `inline; filename="${imageData.filename}"`);

            // Don't set charset for binary data
            res.removeHeader('Content-Type');
            res.setHeader('Content-Type', imageData.mimeType);

            // Send the binary data as a Buffer, not JSON
            res.send(Buffer.from(imageData.data));
        } catch (error: any) {
            // If image not found, return a 404
            if (error.message === 'Profile image not found') {
                res.status(404).json({ error: 'Profile image not found' });
                return;
            }
            throw error;
        }
    } catch (error) {
        console.error('Get profile image error:', error);
        res.status(500).json({ error: 'Failed to retrieve profile image' });
    }
};

// Delete profile image
export const removeProfileImage = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;

        try {
            await deleteProfileImage(userId);
            res.json({ message: 'Profile image deleted successfully' });
        } catch (error: any) {
            // If image not found, it's already deleted
            if (error.code === 'P2025') {
                res.json({ message: 'Profile image already deleted' });
                return;
            }
            throw error;
        }
    } catch (error) {
        console.error('Delete profile image error:', error);
        res.status(500).json({ error: 'Failed to delete profile image' });
    }
};

// Get latest measurements
export const getLatestMeasurementData = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const measurements = await getLatestMeasurements(userId);

        res.json({
            message: 'Latest measurements retrieved successfully',
            measurements
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve measurements' });
    }
};

// Get measurement history for a specific type
export const getMeasurementHistoryData = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { type } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        // Validate measurement type
        if (!['weight', 'height', 'bodyFat'].includes(type)) {
            res.status(400).json({ error: 'Invalid measurement type' });
            return
        }

        const history = await getMeasurementHistory(
            userId,
            type as 'weight' | 'height' | 'bodyFat',
            limit
        );

        res.json({
            message: `${type} measurement history retrieved successfully`,
            history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve measurement history' });
    }
};

// Add a weight measurement
export const addWeight = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { value, date } = req.body;

        // Validate weight value
        if (value === undefined || typeof value !== 'number' || value <= 0) {
            res.status(400).json({ error: 'Valid weight value is required' });
            return
        }

        // Parse date if provided
        let measurementDate: Date | undefined = undefined;
        if (date) {
            measurementDate = new Date(date);
            if (isNaN(measurementDate.getTime())) {
                res.status(400).json({ error: 'Invalid date format' });
                return
            }
        }

        const measurement = await addWeightMeasurement(userId, value, measurementDate);

        res.status(201).json({
            message: 'Weight measurement added successfully',
            measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add weight measurement' });
    }
};

// Add a height measurement
export const addHeight = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { value, date } = req.body;

        // Validate height value
        if (value === undefined || typeof value !== 'number' || value <= 0) {
            res.status(400).json({ error: 'Valid height value is required' });
            return
        }

        // Parse date if provided
        let measurementDate: Date | undefined = undefined;
        if (date) {
            measurementDate = new Date(date);
            if (isNaN(measurementDate.getTime())) {
                res.status(400).json({ error: 'Invalid date format' });
                return
            }
        }

        const measurement = await addHeightMeasurement(userId, value, measurementDate);

        res.status(201).json({
            message: 'Height measurement added successfully',
            measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add height measurement' });
    }
};

// Add a body fat measurement
export const addBodyFat = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { value, date } = req.body;

        // Validate body fat value
        if (value === undefined || typeof value !== 'number' || value < 0 || value > 100) {
            res.status(400).json({ error: 'Body fat must be between 0 and 100' });
            return
        }

        // Parse date if provided
        let measurementDate: Date | undefined = undefined;
        if (date) {
            measurementDate = new Date(date);
            if (isNaN(measurementDate.getTime())) {
                res.status(400).json({ error: 'Invalid date format' });
                return
            }
        }

        const measurement = await addBodyFatMeasurement(userId, value, measurementDate);

        res.status(201).json({
            message: 'Body fat measurement added successfully',
            measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add body fat measurement' });
    }
};