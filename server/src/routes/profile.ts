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
    addBodyFat,
    uploadProfileImage,
    getProfileImage,
    removeProfileImage,
    upload,
    updateSettings
} from '../controllers/profileController';

const router = express.Router();

// All profile routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/', getProfile);
router.patch('/name', updateName);
router.patch('/bio', updateBio);
router.patch('/profile-picture', updateProfilePicture);
router.patch('/settings', updateSettings);

// Profile image routes
router.post('/image', upload.single('image'), uploadProfileImage);
router.get('/image', getProfileImage);
router.get('/image/:userId', getProfileImage); // To get other users' profile images
router.delete('/image', removeProfileImage);

// Measurements routes
router.get('/measurements/latest', getLatestMeasurementData);
router.get('/measurements/:type/history', getMeasurementHistoryData);
router.post('/measurements/weight', addWeight);
router.post('/measurements/height', addHeight);
router.post('/measurements/body-fat', addBodyFat);

export default router;