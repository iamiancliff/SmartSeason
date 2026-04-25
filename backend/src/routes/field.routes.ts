// src/routes/field.routes.ts
import { Router } from 'express';
import { FieldController } from '../controllers/field.controller';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validate } from '../middleware/validate';
import {
  createFieldSchema,
  updateFieldSchema,
  addUpdateSchema,
  assignAgentSchema,
} from '../schemas/field.schema';

const router = Router();

// Apply JWT auth to all field routes
router.use(authenticateToken);

// Admin only
router.post('/', authorizeRoles('ADMIN'), validate(createFieldSchema), FieldController.create);
router.put('/:id', authorizeRoles('ADMIN'), validate(updateFieldSchema), FieldController.update);
router.delete('/:id', authorizeRoles('ADMIN'), FieldController.delete);
router.post('/:id/assign', authorizeRoles('ADMIN'), validate(assignAgentSchema), FieldController.assign);

// All authenticated users (role-filtered in service)
router.get('/', FieldController.getAll);
router.get('/:id', FieldController.getById);
router.get('/:id/updates', FieldController.getUpdates);

// Agent only
router.post('/:id/updates', authorizeRoles('AGENT'), validate(addUpdateSchema), FieldController.addUpdate);

export default router;
