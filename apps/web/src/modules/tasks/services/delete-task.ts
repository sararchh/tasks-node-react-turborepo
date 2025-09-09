import { ApiService } from '@/shared/core';
import { api } from '@/shared/infra';

export type DeleteTaskServiceRequest = string;
export type DeleteTaskServiceResponse = void;

export const deleteTaskService = new ApiService<
  DeleteTaskServiceRequest,
  Promise<DeleteTaskServiceResponse>
>({
  cacheKey: 'deleteTask',
  handler: async (id: DeleteTaskServiceRequest) => {
    await api.delete(`/tasks/${id}`);
  },
});
