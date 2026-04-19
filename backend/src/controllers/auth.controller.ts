// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { AuthService } from '../services/auth.service.ts';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
