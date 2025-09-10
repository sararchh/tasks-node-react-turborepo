import { useGetTasks } from './useGetTasks';
import { useGetTask } from './useGetTask';
import { useCreateTask } from './useCreateTask';
import { useUpdateTask } from './useUpdateTask';
import { useDeleteTask } from './useDeleteTask';
import { useAddComment } from './useAddComment';
import { useGetComments } from './useGetComments';
import { useGetUsers } from './useGetUsers';

export function useTasks() {
  return {
    useGetTasks,
    useGetTask,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useAddComment,
    useGetComments,
    useGetUsers,
  };
}

export { useGetTasks } from './useGetTasks';
export { useGetTask } from './useGetTask';
export { useCreateTask } from './useCreateTask';
export { useUpdateTask } from './useUpdateTask';
export { useDeleteTask } from './useDeleteTask';
export { useAddComment } from './useAddComment';
export { useGetComments } from './useGetComments';
export { useGetUsers } from './useGetUsers';
