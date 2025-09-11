import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteNotificationService } from '../services/delete-notification';
import type { DeleteNotificationServiceRequest } from '../services/delete-notification';

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: DeleteNotificationServiceRequest) => deleteNotificationService.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success('Notificação excluída com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao excluir notificação';
      toast.error(errorMessage);
    },
  });

  return { deleteNotification: mutateAsync, isLoading: isPending };
}