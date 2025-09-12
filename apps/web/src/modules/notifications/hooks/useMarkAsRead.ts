import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { markAsReadService } from '../services/mark-as-read';
import type { MarkAsReadServiceRequest } from '../services/mark-as-read';

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: MarkAsReadServiceRequest) => markAsReadService.execute(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success('Notificação marcada como lida!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao marcar notificação como lida';
      toast.error(errorMessage);
    },
  });

  return { markAsRead: mutateAsync, isLoading: isPending };
}