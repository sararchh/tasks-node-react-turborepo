import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';

export type GetUsersServiceRequest = void;
export type GetUsersServiceResponse = { id: string; email: string; username: string }[];

export const getUsersService = new ApiService<
  GetUsersServiceRequest,
  Promise<GetUsersServiceResponse>
>({
  cacheKey: 'getUsers',
  handler: async () => {
    const { data } = await api.get('/users');
    return data.data || data;
  },
});
