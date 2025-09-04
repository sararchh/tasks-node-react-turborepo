import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';
import { LoginRequest, AuthResponse } from '@igame/types';

export type LoginServiceRequest = LoginRequest;

export type LoginServiceResponse = AuthResponse;

type LoginApiResponse = AuthResponse;

export const loginService = new ApiService<
  LoginServiceRequest,
  Promise<LoginServiceResponse>
>({
  cacheKey: 'login',
  handler: async (req: LoginServiceRequest) => {
    const { data } = await api.post<LoginApiResponse>('/auth/login', req);
    return data;
  },
});
