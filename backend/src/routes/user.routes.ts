// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller.ts';
import { authenticateToken } from '../middleware/auth.ts';
import { authorizeRoles } from '../middleware/roles.ts';
import { validate } from '../middleware/validate.ts';
import { z } from 'zod';

const router = Router();

const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'AGENT'], { message: 'Role must be ADMIN or AGENT' }),
});

// All user management routes require ADMIN
router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id/role', validate(updateRoleSchema), UserController.updateRole);

export default router;
