import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  createTaskService,
  getTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService,
  addCommentService,
  getCommentsService,
  getUsersService,
  type CreateTaskServiceRequest,
  type UpdateTaskServiceRequest,
  type AddCommentServiceRequest,
  type GetCommentsServiceRequest,
} from '../services/task.services';
import { TaskQueryDto } from '../types/task.types';

// Hook para buscar tarefas
export const useTasks = (query?: TaskQueryDto) => {
  return useQuery({
    queryKey: ['tasks', query],
    queryFn: () => getTasksService.execute(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook para buscar uma tarefa específica
export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskService.execute(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook para buscar usuários
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsersService.execute(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook para buscar comentários
export const useComments = (params: GetCommentsServiceRequest) => {
  return useQuery({
    queryKey: ['comments', params.taskId, params.page || 1, params.size || 10],
    queryFn: () => getCommentsService.execute(params),
    enabled: !!params.taskId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Hook para criar tarefa
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskServiceRequest) => createTaskService.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao criar tarefa';
      toast.error(errorMessage);
    },
  });
};

// Hook para atualizar tarefa
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskServiceRequest) => updateTaskService.execute(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
      toast.success('Tarefa atualizada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao atualizar tarefa';
      toast.error(errorMessage);
    },
  });
};

// Hook para deletar tarefa
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTaskService.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa excluída com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Erro ao excluir tarefa';
      toast.error(errorMessage);
    },
  });
};

// Hook para adicionar comentário
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCommentServiceRequest) => addCommentService.execute(data),
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
};
