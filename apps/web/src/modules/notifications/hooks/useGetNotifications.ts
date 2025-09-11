import { useQuery } from '@tanstack/react-query';
import { getNotificationsService } from '../services/get-notifications';
import type { GetNotificationsServiceRequest } from '../services/get-notifications';

export function useGetNotifications(query?: GetNotificationsServiceRequest) {
  return useQuery({
    queryKey: ['notifications', query],
    queryFn: () => getNotificationsService.execute(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
