export { TasksDashboard } from './pages/TasksDashboard';
export { TaskForm } from './components/TaskForm';
export { TaskDetail } from './components/TaskDetail';
export { TaskFilters } from './components/TaskFilters';

export * from './types/task.types';

// Export hooks
export * from './hooks/useTasks';
export * from './hooks/useCreateTask';
export * from './hooks/useGetTasks';
export * from './hooks/useGetTask';
export * from './hooks/useUpdateTask';
export * from './hooks/useDeleteTask';
export * from './hooks/useAddComment';
export * from './hooks/useGetComments';
export * from './hooks/useGetUsers';

// Export services
export * from './services/create-task';
export * from './services/get-tasks';
export * from './services/get-task';
export * from './services/update-task';
export * from './services/delete-task';
export * from './services/add-comment';
export * from './services/get-comments';
export * from './services/get-users';
