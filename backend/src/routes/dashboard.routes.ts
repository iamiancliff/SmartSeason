// src/routes/dashboard.routes.ts
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

router.get('/', authenticateToken, DashboardController.getDashboard);

export default router;
