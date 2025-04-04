import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    getProfile,
    updateName,
    updateBio,
    updateProfilePicture,
    getLatestMeasurementData,
    getMeasurementHistoryData,
    addWeight,
    addHeight,
    addBodyFat
} from '../controllers/profileController';

const router = express.Router();

// All profile routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/', getProfile);
router.patch('/name', updateName);
router.patch('/bio', updateBio);
router.patch('/profile-picture', updateProfilePicture);

// Measurements routes
router.get('/measurements/latest', getLatestMeasurementData);
router.get('/measurements/:type/history', getMeasurementHistoryData);
router.post('/measurements/weight', addWeight);
router.post('/measurements/height', addHeight);
router.post('/measurements/body-fat', addBodyFat);

export default router;