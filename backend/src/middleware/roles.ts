// src/middleware/roles.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.ts';

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Role ${req.user?.role || 'Guest'} lacks permission for this action.` 
      });
    }
    next();
  };
};
