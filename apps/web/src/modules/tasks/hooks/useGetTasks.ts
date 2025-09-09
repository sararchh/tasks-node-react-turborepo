import { useQuery } from '@tanstack/react-query';
import { getTasksService } from '../services/get-tasks';
import type { GetTasksServiceRequest } from '../services/get-tasks';

export function useGetTasks(query?: GetTasksServiceRequest) {
  return useQuery({
    queryKey: ['tasks', query],
    queryFn: () => getTasksService.execute(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
