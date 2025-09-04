import { useMutation } from '@tanstack/react-query';
import { registerService } from '../services/register';
import type { RegisterServiceRequest } from '../services/register';

export function useRegister() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: RegisterServiceRequest) => registerService.execute(values),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    },
  });

  return { register: mutateAsync, isLoading: isPending };
}
