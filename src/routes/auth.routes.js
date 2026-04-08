import express from 'express';
import { login, getMe, verifyToken, changePassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.get('/verify', protect, verifyToken);
router.put('/change-password', protect, changePassword);

export default router;
