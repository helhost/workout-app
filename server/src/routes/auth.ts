import express from 'express';
import { registerUser, loginController } from '../controllers/authController';
import { getProfile } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginController);
router.get('/profile', authenticateToken, getProfile);

export default router;