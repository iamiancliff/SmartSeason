// src/controllers/field.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { FieldService } from '../services/field.service';

export class FieldController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const field = await FieldService.createField(req.body);
      res.status(201).json(field);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const fields = await FieldService.getAllFields(req.user?.id, req.user?.role);
      res.json(fields);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const field = await FieldService.getFieldById(req.params.id as string, req.user!.id, req.user!.role);
      res.json(field);
    } catch (error) {
      next(error);
    }
  }

  static async assign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const field = await FieldService.assignAgent(req.params.id as string, req.body.agentId);
      res.json(field);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const field = await FieldService.updateField(req.params.id as string, req.body);
      res.json(field);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await FieldService.deleteField(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async addUpdate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await FieldService.addUpdate(req.params.id as string, req.user!.id, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getUpdates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updates = await FieldService.getFieldUpdates(
        req.params.id as string,
        req.user!.id,
        req.user!.role
      );
      res.json(updates);
    } catch (error) {
      next(error);
    }
  }
}
