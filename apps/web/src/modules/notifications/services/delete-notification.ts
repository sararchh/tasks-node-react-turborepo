import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';

export type DeleteNotificationServiceRequest = { notificationId: string };
export type DeleteNotificationServiceResponse = void;

export const deleteNotificationService = new ApiService<
  DeleteNotificationServiceRequest,
  Promise<DeleteNotificationServiceResponse>
>({
  cacheKey: 'deleteNotification',
  handler: async ({ notificationId }: DeleteNotificationServiceRequest) => {
    await api.delete(`/notifications/${notificationId}`);
  },
});
