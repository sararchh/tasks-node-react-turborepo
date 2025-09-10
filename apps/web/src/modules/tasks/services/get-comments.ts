import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { PaginatedComments } from '../types/task.types';

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

    return {
      comments: data.data || [],
      total: data.meta?.total || 0,
      page: data.meta?.page || 1,
      size: data.meta?.size || 10,
      totalPages: data.meta?.totalPages || 1,
    };
  },
});
