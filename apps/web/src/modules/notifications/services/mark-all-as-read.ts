import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';

export type MarkAllAsReadServiceRequest = { userId: string };
export type MarkAllAsReadServiceResponse = void;

export const markAllAsReadService = new ApiService<
  MarkAllAsReadServiceRequest,
  Promise<MarkAllAsReadServiceResponse>
>({
  cacheKey: 'markAllAsRead',
  handler: async ({ userId }: MarkAllAsReadServiceRequest) => {
    await api.put(`/notifications/user/${userId}/mark-all-read`);
  },
});