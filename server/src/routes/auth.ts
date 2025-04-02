import express from 'express';
import { registerUser, loginController } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginController);

export default router;