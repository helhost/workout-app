import express from 'express';
import {
    handleRegister,
    handleLogin,
    handleLogout,
    handleRefreshToken
} from '../controllers/authController';

const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.post('/refresh', handleRefreshToken);

export default router;