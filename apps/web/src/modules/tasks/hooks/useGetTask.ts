import { useQuery } from '@tanstack/react-query';
import { getTaskService } from '../services/get-task';
import type { GetTaskServiceRequest } from '../services/get-task';

export function useGetTask(id: GetTaskServiceRequest) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskService.execute(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
