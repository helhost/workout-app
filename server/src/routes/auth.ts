import express from 'express';
import { registerUser, loginController } from '../controllers/authController';
import { getProfile } from '../controllers/profileController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginController);
router.get('/profile/:id', getProfile);

export default router;