import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { NotificationQueryDto, PaginatedNotificationResponse } from '../types';

export type GetNotificationsServiceRequest = NotificationQueryDto;
export type GetNotificationsServiceResponse = PaginatedNotificationResponse;

export const getNotificationsService = new ApiService<
  GetNotificationsServiceRequest,
  Promise<GetNotificationsServiceResponse>
>({
  cacheKey: 'getNotifications',
  handler: async (params: GetNotificationsServiceRequest = {}) => {
    const searchParams = new URLSearchParams();

    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const url = searchParams.toString()
      ? `/notifications?${searchParams.toString()}`
      : '/notifications';

    const { data } = await api.get<GetNotificationsServiceResponse>(url);
    return data;
  },
});