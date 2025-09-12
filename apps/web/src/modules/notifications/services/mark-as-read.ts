import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { Notification } from '../types';

export type MarkAsReadServiceRequest = { notificationId: string };
export type MarkAsReadServiceResponse = Notification;

export const markAsReadService = new ApiService<
  MarkAsReadServiceRequest,
  Promise<MarkAsReadServiceResponse>
>({
  cacheKey: 'markAsRead',
  handler: async ({ notificationId }: MarkAsReadServiceRequest) => {
    const { data } = await api.put<MarkAsReadServiceResponse>(
      `/notifications/${notificationId}/mark-read`
    );
    return data;
  },
});
