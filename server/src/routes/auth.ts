import express from 'express';
import {
    registerUser,
    loginController,
    refreshToken,
    logout
} from '../controllers/authController';
import { getProfile } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginController);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/profile', authenticateToken, getProfile);

export default router;