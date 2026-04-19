// src/controllers/user.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { UserService } from '../services/user.service.ts';

export class UserController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id as string);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const user = await UserService.updateUserRole(req.params.id as string, role);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
