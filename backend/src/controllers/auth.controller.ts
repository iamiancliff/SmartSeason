// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/auth.service';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

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

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(req.user!.id, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async uploadPhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      const user = await AuthService.uploadProfilePhoto(req.user!.id, imageUrl);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
