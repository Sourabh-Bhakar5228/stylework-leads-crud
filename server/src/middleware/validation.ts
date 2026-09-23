import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { LEAD_STATUSES } from '../types/lead.types';

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(5, 'Phone number must be at least 5 digits/characters')
    .max(25, 'Phone number must not exceed 25 characters')
    .regex(/^[0-9+\s\-().]+$/, 'Phone number contains invalid characters'),
  status: z
    .enum(LEAD_STATUSES, {
      errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` })
    })
    .optional()
    .default('New'),
  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional()
    .default('')
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` })
  })
});

export const updateLeadSchema = createLeadSchema.partial();

export function validateBody(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
}
