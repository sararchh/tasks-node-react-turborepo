import { useMutation } from '@tanstack/react-query';
import { loginService } from '../services/login';
import type { LoginServiceRequest } from '../services/login';
import { setUserStorage } from '@/shared/utils/jwt';

export function useLogin() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: LoginServiceRequest) => loginService.execute(values),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      if (data.user) {
        setUserStorage(data.user);
      }
    },
  });

  return { login: mutateAsync, isLoading: isPending };
}
