import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { handleUpdateProfile, handleChangePassword } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

// Settings / User Profile
router.patch('/profile', authenticate, handleUpdateProfile);
router.post('/change-password', authenticate, handleChangePassword);

export default router;
