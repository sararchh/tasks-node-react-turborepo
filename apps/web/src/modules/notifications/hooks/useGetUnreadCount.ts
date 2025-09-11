import { useQuery } from '@tanstack/react-query';
import { getUnreadCountService } from '../services/get-unread-count';

export function useGetUnreadCount(userId: string) {
  return useQuery({
    queryKey: ['unreadCount', userId],
    queryFn: () => getUnreadCountService.execute({ userId }),
    enabled: !!userId,
    refetchInterval: 1000 * 30, // 30 seconds
    staleTime: 1000 * 15, // 15 seconds
  });
}
