import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { addCommentService } from '../services/add-comment';
import type { AddCommentServiceRequest } from '../services/add-comment';

export function useAddComment() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: AddCommentServiceRequest) => addCommentService.execute(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.taskId]
      });
      queryClient.invalidateQueries({
        queryKey: ['task', variables.taskId]
      });
      toast.success('Comentário adicionado com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao adicionar comentário';
      toast.error(errorMessage);
    },
  });

  return { addComment: mutateAsync, isLoading: isPending };
}
