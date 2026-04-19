// src/schemas/field.schema.ts
import { z } from 'zod';

const StageEnum = z.enum(['PLANTED', 'GROWING', 'READY', 'HARVESTED']);

export const createFieldSchema = z.object({
  name: z.string().min(2, 'Field name must be at least 2 characters'),
  cropType: z.string().min(2, 'Crop type must be at least 2 characters'),
  plantingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid planting date',
  }),
  currentStage: StageEnum.optional(),
});

export const updateFieldSchema = z.object({
  name: z.string().min(2).optional(),
  cropType: z.string().min(2).optional(),
  plantingDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid planting date' })
    .optional(),
  currentStage: StageEnum.optional(),
});

export const addUpdateSchema = z.object({
  stage: StageEnum,
  note: z.string().optional(),
});

export const assignAgentSchema = z.object({
  agentId: z.string().uuid('Invalid agent ID'),
});

export type CreateFieldInput = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>;
export type AddUpdateInput = z.infer<typeof addUpdateSchema>;
