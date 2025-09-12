import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { RegisterRequest, AuthResponse } from '../types';

export type RegisterServiceRequest = RegisterRequest;

export type RegisterServiceResponse = AuthResponse;

type RegisterApiResponse = AuthResponse;

export const registerService = new ApiService<
  RegisterServiceRequest,
  Promise<RegisterServiceResponse>
>({
  cacheKey: 'register',
  handler: async (req: RegisterServiceRequest) => {
    const { data } = await api.post<RegisterApiResponse>('/auth/register', req);
    return data;
  },
});
