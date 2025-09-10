import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteTaskService } from '../services/delete-task';
import type { DeleteTaskServiceRequest } from '../services/delete-task';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: DeleteTaskServiceRequest) => deleteTaskService.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa excluída com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao excluir tarefa';
      toast.error(errorMessage);
    },
  });

  return { deleteTask: mutateAsync, isLoading: isPending };
}
