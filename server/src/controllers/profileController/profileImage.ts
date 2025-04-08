import { Request, Response } from 'express';
import multer from 'multer';
import {
    saveProfileImage,
    getProfileImageData,
    deleteProfileImage
} from '../../services/profileService';

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

// Configure multer upload - exported and used in routes
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: fileFilter
});

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