import { Router } from 'express';
import multer from 'multer';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, changePasswordSchema } from '../schemas/auth.schema';

const router = Router();

// Multer config for profile photo uploads using memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authenticateToken, AuthController.me);
router.put('/password', authenticateToken, validate(changePasswordSchema), AuthController.changePassword);
router.post('/photo', authenticateToken, upload.single('photo'), AuthController.uploadPhoto);

export default router;
