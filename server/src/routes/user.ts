import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    // User
    handleGetUserById,
    handleUpdateUsername,
    handleUpdateBio,
    handleUpdateSettings,
    // Measurements
    handleGetLatestMeasurements,
    handleGetMeasurementHistory,
    handleAddWeightMeasurement,
    handleAddHeightMeasurement,
    handleAddBodyFatMeasurement,
    // Profile Image
    handleUploadProfileImage,
    handleGetProfileImage,
    handleGetProfileImageMetadata,
    handleDeleteProfileImage
} from '../controllers/userController';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// All profile routes require authentication
router.use(authenticateToken);

// User routes
router.get('/', handleGetUserById);
router.patch('/name', handleUpdateUsername);
router.patch('/bio', handleUpdateBio);
router.patch('/settings', handleUpdateSettings);

// Profile image routes
router.post('/image', upload.single('image'), handleUploadProfileImage);
router.get('/image', handleGetProfileImage);
router.get('/image/metadata', handleGetProfileImageMetadata);
router.delete('/image', handleDeleteProfileImage);

// Measurements routes
router.get('/measurements/latest', handleGetLatestMeasurements);
router.get('/measurements/history', handleGetMeasurementHistory);
router.post('/measurements/weight', handleAddWeightMeasurement);
router.post('/measurements/height', handleAddHeightMeasurement);
router.post('/measurements/body-fat', handleAddBodyFatMeasurement);

export default router;