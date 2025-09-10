import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TaskPriority, TaskStatus, Task } from '../../types/task.types';
import { useGetUsers } from '../../hooks/useGetUsers';

interface TaskFormData {
  title: string;
  description: string;
  deadline?: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assignedUserIds: string[];
  assignedUsers?: Array<{ id: string; username: string }>;
}

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  task,
  isLoading = false,
}) => {
  const isEditing = !!task;
  const { data: users = [] } = useGetUsers();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      deadline: task?.deadline ? task.deadline.split('T')[0] : '',
      priority: task?.priority || TaskPriority.MEDIUM,
      status: task?.status || TaskStatus.TODO,
      assignedUserIds: task?.assignments?.map(a => a.userId) || [],
    },
  });

  const selectedUserIds = watch('assignedUserIds') || [];

  React.useEffect(() => {
    if (task && isEditing) {
      reset({
        title: task.title,
        description: task.description,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        priority: task.priority,
        status: task.status,
        assignedUserIds: task.assignments.map(a => a.userId),
      });
    }
  }, [task, isEditing, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    // Remove status field if creating new task
    if (!isEditing) {
      delete data.status;
    }

    // Add assignedUsers information based on selected IDs
    if (data.assignedUserIds && data.assignedUserIds.length > 0) {
      data.assignedUsers = data.assignedUserIds.map((userId) => {
        const user = users.find((u) => u.id === userId);
        return {
          id: userId,
          username: user?.username || user?.email || 'Unknown User',
        };
      });
    }

    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (!isEditing) {
      reset();
    }
  };

  const toggleUserAssignment = (userId: string) => {
    const currentIds = selectedUserIds;
    const newIds = currentIds.includes(userId)
      ? currentIds.filter(id => id !== userId)
      : [...currentIds, userId];
    setValue('assignedUserIds', newIds);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título*</Label>
            <Input
              id="title"
              {...register('title', {
                required: 'Título é obrigatório',
                minLength: { value: 3, message: 'Título deve ter pelo menos 3 caracteres' }
              })}
              placeholder="Digite o título da tarefa..."
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição*</Label>
            <Textarea
              id="description"
              {...register('description', {
                required: 'Descrição é obrigatória',
                minLength: { value: 10, message: 'Descrição deve ter pelo menos 10 caracteres' }
              })}
              placeholder="Descreva a tarefa..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                {...register('deadline')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                id="priority"
                {...register('priority')}
              >
                <option value={TaskPriority.LOW}>Baixa</option>
                <option value={TaskPriority.MEDIUM}>Média</option>
                <option value={TaskPriority.HIGH}>Alta</option>
                <option value={TaskPriority.URGENT}>Urgente</option>
              </Select>
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                {...register('status')}
              >
                <option value={TaskStatus.TODO}>A Fazer</option>
                <option value={TaskStatus.IN_PROGRESS}>Em Progresso</option>
                <option value={TaskStatus.REVIEW}>Em Revisão</option>
                <option value={TaskStatus.DONE}>Concluído</option>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Atribuir Usuários</Label>
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum usuário disponível</p>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleUserAssignment(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">
                        {user.username} ({user.email})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Atualizar' : 'Criar'} Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
