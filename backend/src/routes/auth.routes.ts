// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.ts';
import { authenticateToken } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';
import { registerSchema, loginSchema } from '../schemas/auth.schema.ts';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authenticateToken, AuthController.me);

export default router;
