import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { Task } from '../types/task.types';

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
