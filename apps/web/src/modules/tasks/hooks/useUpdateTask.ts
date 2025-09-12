import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateTaskService } from '../services/update-task';
import type { UpdateTaskServiceRequest } from '../services/update-task';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UpdateTaskServiceRequest) => updateTaskService.execute(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao atualizar tarefa';
      toast.error(errorMessage);
    },
  });

  return { updateTask: mutateAsync, isLoading: isPending };
}
