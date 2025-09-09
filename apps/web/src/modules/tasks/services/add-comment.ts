import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { CreateCommentDto } from '../types/task.types';

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
