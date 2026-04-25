// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validate } from '../middleware/validate';
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
router.delete('/:id', UserController.delete);

export default router;
