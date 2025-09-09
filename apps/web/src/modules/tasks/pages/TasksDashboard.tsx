import React, { useState, useMemo } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { TaskDetail } from '../components/TaskDetail';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { Task, TaskQueryDto, TaskStatus } from '../types/task.types';

export const TasksDashboard: React.FC = () => {
  const [filters, setFilters] = useState<TaskQueryDto>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: tasksData, isLoading, error } = useTasks({
    ...filters,
    page: 1,
    size: 100, // Carregar mais tarefas para o Kanban
  });

  const tasks = useMemo(() => tasksData?.tasks || [], [tasksData?.tasks]);
  const total = tasksData?.total || 0;

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleCreateTask = (data: any) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        setShowTaskForm(false);
      },
    });
  };

  const handleUpdateTask = (data: any) => {
    if (!editingTask) return;

    updateTaskMutation.mutate(
      { id: editingTask.id, data },
      {
        onSuccess: () => {
          setEditingTask(null);
          setSelectedTask(null);
        },
      }
    );
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTaskMutation.mutate(taskId, {
        onSuccess: () => {
          setSelectedTask(null);
        },
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setSelectedTask(null);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation.mutate(
      { id: taskId, data: { status: newStatus } },
      {
        onSuccess: () => {
          // Task moved successfully
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
            <p className="text-gray-600 mt-1">
              Gerencie suas tarefas e acompanhe o progresso
            </p>
          </div>
          <Button
            onClick={() => setShowTaskForm(true)}
            disabled={createTaskMutation.isPending}
          >
            <Plus size={16} className="mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Kanban View */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border">
            <TaskFilters
              onFiltersChange={handleFiltersChange}
              loading={isLoading}
            />
          </div>

          {/* Kanban Board */}
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="text-red-500 mx-auto mb-2" size={24} />
              <h3 className="text-red-800 font-medium">Erro ao carregar tarefas</h3>
              <p className="text-red-600 text-sm mt-1">
                Tente novamente em alguns instantes.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-80 min-h-[600px] bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <KanbanBoard
              tasks={tasks}
              onTaskMove={handleTaskMove}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onTaskView={handleViewTask}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <TaskForm
        open={showTaskForm}
        onOpenChange={setShowTaskForm}
        onSubmit={handleCreateTask}
        isLoading={createTaskMutation.isPending}
      />

      <TaskForm
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask || undefined}
        isLoading={updateTaskMutation.isPending}
      />

      <TaskDetail
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};
