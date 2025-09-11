import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { markAllAsReadService } from '../services/mark-all-as-read';
import type { MarkAllAsReadServiceRequest } from '../services/mark-all-as-read';

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: MarkAllAsReadServiceRequest) => markAllAsReadService.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success('Todas as notificações foram marcadas como lidas!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao marcar todas as notificações como lidas';
      toast.error(errorMessage);
    },
  });

  return { markAllAsRead: mutateAsync, isLoading: isPending };
}
