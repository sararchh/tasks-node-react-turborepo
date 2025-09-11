import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { Notification } from '../types';

export type GetUserNotificationsServiceRequest = { userId: string };
export type GetUserNotificationsServiceResponse = Notification[];

export const getUserNotificationsService = new ApiService<
  GetUserNotificationsServiceRequest,
  Promise<GetUserNotificationsServiceResponse>
>({
  cacheKey: 'getUserNotifications',
  handler: async ({ userId }: GetUserNotificationsServiceRequest) => {
    const { data } = await api.get<GetUserNotificationsServiceResponse>(`/notifications/user/${userId}`);
    return data;
  },
});