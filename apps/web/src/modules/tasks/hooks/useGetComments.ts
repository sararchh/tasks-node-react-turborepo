import { useQuery } from '@tanstack/react-query';
import { getCommentsService } from '../services/get-comments';
import type { GetCommentsServiceRequest } from '../services/get-comments';

export function useGetComments(params: GetCommentsServiceRequest) {
  return useQuery({
    queryKey: ['comments', params.taskId, params.page || 1, params.size || 10],
    queryFn: () => getCommentsService.execute(params),
    enabled: !!params.taskId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
