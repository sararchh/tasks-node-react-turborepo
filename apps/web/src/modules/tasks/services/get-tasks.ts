import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { PaginatedTasks, TaskQueryDto } from '../types/task.types';

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
