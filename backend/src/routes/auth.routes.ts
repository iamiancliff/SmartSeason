// src/routes/auth.routes.ts
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { AuthController } from '../controllers/auth.controller.ts';
import { authenticateToken } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';
import { registerSchema, loginSchema, changePasswordSchema } from '../schemas/auth.schema.ts';

const router = Router();

// Multer config for profile photo uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authenticateToken, AuthController.me);
router.put('/password', authenticateToken, validate(changePasswordSchema), AuthController.changePassword);
router.post('/photo', authenticateToken, upload.single('photo'), AuthController.uploadPhoto);

export default router;
