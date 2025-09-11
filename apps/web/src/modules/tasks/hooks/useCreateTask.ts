import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createTaskService } from '../services/create-task';
import type { CreateTaskServiceRequest } from '../services/create-task';

export function useCreateTask() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: CreateTaskServiceRequest) => createTaskService.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao criar tarefa';
      toast.error(errorMessage);
    },
  });

  return { createTask: mutateAsync, isLoading: isPending };
}
