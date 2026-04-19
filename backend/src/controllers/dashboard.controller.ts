// src/controllers/dashboard.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { DashboardService } from '../services/dashboard.service.ts';

export class DashboardController {
  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user!.role === 'ADMIN') {
        const data = await DashboardService.getAdminDashboard();
        res.json({ role: 'ADMIN', ...data });
      } else {
        const data = await DashboardService.getAgentDashboard(req.user!.id);
        res.json({ role: 'AGENT', ...data });
      }
    } catch (error) {
      next(error);
    }
  }
}
