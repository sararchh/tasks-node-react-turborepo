import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { UpdateTaskDto, Task } from '../types/task.types';

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
