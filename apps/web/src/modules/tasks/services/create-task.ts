import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { CreateTaskDto, Task } from '../types/task.types';

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
