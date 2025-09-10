import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../types/task.types';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),
  deadline: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date > new Date();
    }, 'Data de prazo deve ser futura'),
  priority: z
    .nativeEnum(TaskPriority)
    .optional()
    .default(TaskPriority.MEDIUM),
  assignedUserIds: z
    .array(z.string().uuid('ID de usuário deve ser um UUID válido'))
    .optional()
    .default([]),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .optional(),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
    .optional(),
  deadline: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date > new Date();
    }, 'Data de prazo deve ser futura'),
  priority: z
    .nativeEnum(TaskPriority)
    .optional(),
  status: z
    .nativeEnum(TaskStatus)
    .optional(),
  assignedUserIds: z
    .array(z.string().uuid('ID de usuário deve ser um UUID válido'))
    .optional(),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comentário não pode estar vazio')
    .max(1000, 'Comentário deve ter no máximo 1000 caracteres'),
});

export const taskFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assignedToMe: z.boolean().optional(),
  page: z.number().min(1).optional().default(1),
  size: z.number().min(1).max(100).optional().default(10),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type TaskFiltersFormData = z.infer<typeof taskFiltersSchema>;
