import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { UnreadCountResponse } from '../types';

export type GetUnreadCountServiceRequest = { userId: string };
export type GetUnreadCountServiceResponse = UnreadCountResponse;

export const getUnreadCountService = new ApiService<
  GetUnreadCountServiceRequest,
  Promise<GetUnreadCountServiceResponse>
>({
  cacheKey: 'getUnreadCount',
  handler: async ({ userId }: GetUnreadCountServiceRequest) => {
    const { data } = await api.get<GetUnreadCountServiceResponse>(
      `/notifications/user/${userId}/unread-count`
    );
    return data;
  },
});