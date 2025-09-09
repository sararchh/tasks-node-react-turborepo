import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import {
  Task,
  PaginatedTasks,
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  PaginatedComments,
  CreateCommentDto
} from '../types/task.types';

// Create Task Service
export type CreateTaskServiceRequest = CreateTaskDto;
export type CreateTaskServiceResponse = Task;

export const createTaskService = new ApiService<
  CreateTaskServiceRequest,
  Promise<CreateTaskServiceResponse>
>({
  cacheKey: 'createTask',
  handler: async (req: CreateTaskServiceRequest) => {
    const { data } = await api.post<CreateTaskServiceResponse>('/tasks', req);
    return data;
  },
});

// Get Tasks Service
export type GetTasksServiceRequest = TaskQueryDto;
export type GetTasksServiceResponse = PaginatedTasks;

export const getTasksService = new ApiService<
  GetTasksServiceRequest,
  Promise<GetTasksServiceResponse>
>({
  cacheKey: 'getTasks',
  handler: async (req: GetTasksServiceRequest = {}) => {
    const { data } = await api.get('/tasks', { params: req });

    // Transform backend response to match our expected format
    return {
      tasks: data.data || [],
      total: data.meta?.total || 0,
      page: data.meta?.page || 1,
      size: data.meta?.size || 12,
      totalPages: data.meta?.totalPages || 1,
    };
  },
});

// Get Task by ID Service
export type GetTaskServiceRequest = string;
export type GetTaskServiceResponse = Task;

export const getTaskService = new ApiService<
  GetTaskServiceRequest,
  Promise<GetTaskServiceResponse>
>({
  cacheKey: 'getTask',
  handler: async (id: GetTaskServiceRequest) => {
    const { data } = await api.get(`/tasks/${id}`);
    // If backend wraps single task in data object, unwrap it
    return data.data || data;
  },
});

// Update Task Service
export type UpdateTaskServiceRequest = { id: string; data: UpdateTaskDto };
export type UpdateTaskServiceResponse = Task;

export const updateTaskService = new ApiService<
  UpdateTaskServiceRequest,
  Promise<UpdateTaskServiceResponse>
>({
  cacheKey: 'updateTask',
  handler: async ({ id, data: updateData }: UpdateTaskServiceRequest) => {
    const { data } = await api.patch<UpdateTaskServiceResponse>(`/tasks/${id}`, updateData);
    return data;
  },
});

// Delete Task Service
export type DeleteTaskServiceRequest = string;
export type DeleteTaskServiceResponse = void;

export const deleteTaskService = new ApiService<
  DeleteTaskServiceRequest,
  Promise<DeleteTaskServiceResponse>
>({
  cacheKey: 'deleteTask',
  handler: async (id: DeleteTaskServiceRequest) => {
    await api.delete(`/tasks/${id}`);
  },
});

// Add Comment Service
export type AddCommentServiceRequest = { taskId: string; data: CreateCommentDto };
export type AddCommentServiceResponse = any;

export const addCommentService = new ApiService<
  AddCommentServiceRequest,
  Promise<AddCommentServiceResponse>
>({
  cacheKey: 'addComment',
  handler: async ({ taskId, data: commentData }: AddCommentServiceRequest) => {
    const { data } = await api.post<AddCommentServiceResponse>(`/tasks/${taskId}/comments`, commentData);
    return data;
  },
});

// Get Comments Service
export type GetCommentsServiceRequest = { taskId: string; page?: number; size?: number };
export type GetCommentsServiceResponse = PaginatedComments;

export const getCommentsService = new ApiService<
  GetCommentsServiceRequest,
  Promise<GetCommentsServiceResponse>
>({
  cacheKey: 'getComments',
  handler: async ({ taskId, page = 1, size = 10 }: GetCommentsServiceRequest) => {
    const { data } = await api.get(`/tasks/${taskId}/comments`, {
      params: { page, size }
    });

    // Transform backend response to match our expected format
    return {
      comments: data.data || [],
      total: data.meta?.total || 0,
      page: data.meta?.page || 1,
      size: data.meta?.size || 10,
      totalPages: data.meta?.totalPages || 1,
    };
  },
});

// Get Users Service (for assignment)
export type GetUsersServiceRequest = void;
export type GetUsersServiceResponse = { id: string; email: string; username: string }[];

export const getUsersService = new ApiService<
  GetUsersServiceRequest,
  Promise<GetUsersServiceResponse>
>({
  cacheKey: 'getUsers',
  handler: async () => {
    const { data } = await api.get('/users');
    // If backend wraps users in data object, unwrap it
    return data.data || data;
  },
});
