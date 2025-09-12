import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanBoard } from "../components/KanbanBoard";
import { TaskFilters } from "../components/TaskFilters";
import { TaskForm } from "../components/TaskForm";
import { TaskDetail } from "../components/TaskDetail";
import {
  useGetTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../hooks/useTasks";
import { Task, TaskQueryDto, TaskStatus } from "../types/task.types";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { toast } from "react-toastify";

interface TasksMainProps {
  user: {
    username?: string;
    email?: string;
  } | null;
}

export const TasksMain: React.FC<TasksMainProps> = ({ user }) => {
  const { user: authUser } = useAuth();
  const [filters, setFilters] = useState<TaskQueryDto>({});
  const [debouncedFilters, setDebouncedFilters] = useState<TaskQueryDto>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const {
    data: tasksData,
    isLoading,
    error,
    isFetching,
  } = useGetTasks({
    ...debouncedFilters,
    page: 1,
    size: 100,
  });

  const tasks = useMemo(() => tasksData?.tasks || [], [tasksData?.tasks]);
  const total = useMemo(() => tasksData?.total || 0, [tasksData?.total]);

  const { createTask, isLoading: createLoading } = useCreateTask();
  const { updateTask, isLoading: updateLoading } = useUpdateTask();
  const { deleteTask, isLoading: deleteLoading } = useDeleteTask();

  const handleCreateTask = useCallback(
    (data: any) => {
      createTask(data, {
        onSuccess: () => {
          setShowTaskForm(false);
        },
      });
    },
    [createTask],
  );

  const handleUpdateTask = useCallback(
    (data: any) => {
      if (!editingTask) return;

      updateTask(
        { id: editingTask.id, data },
        {
          onSuccess: () => {
            setEditingTask(null);
            setSelectedTask(null);
          },
        },
      );
    },
    [editingTask, updateTask],
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);

      if (!task) return;

      if (!authUser?.id) {
        toast.error("Erro: usuário não identificado");
        return;
      }

      if (task.createdBy !== authUser.id) {
        toast.error("Você só pode excluir tarefas que você criou");
        return;
      }

      if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
        deleteTask(taskId, {
          onSuccess: () => {
            setSelectedTask(null);
          },
        });
      }
    },
    [deleteTask, tasks, authUser?.id],
  );

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setSelectedTask(null);
  }, []);

  const handleViewTask = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  const handleTaskMove = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      updateTask({ id: taskId, data: { status: newStatus } });
    },
    [updateTask],
  );

  const tasksText = useMemo(() => {
    if (total === 0) return "Nenhuma tarefa encontrada";
    return `${total} tarefa${total !== 1 ? "s" : ""} encontrada${total !== 1 ? "s" : ""}`;
  }, [total]);

  return (
    <main className="flex-1 h-full">
      <div className=" sm:px-6 !m-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !mb-4 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gerenciamento de Tarefas
            </h2>
            <p className="text-gray-600 mt-1">
              {tasksText}
            </p>
          </div>

          <Button
            onClick={() => setShowTaskForm(true)}
            disabled={createLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            Nova Tarefa
          </Button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <TaskFilters
              onFiltersChange={handleFiltersChange}
              loading={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
              <h3 className="text-red-800 font-semibold text-lg mb-2">
                Erro ao carregar tarefas
              </h3>
              <p className="text-red-600">
                Ocorreu um erro ao carregar suas tarefas. Tente novamente em
                alguns instantes.
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[70vh] relative">
            <KanbanBoard
              tasks={tasks}
              onTaskMove={handleTaskMove}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onTaskView={handleViewTask}
              isFetching={isFetching}
            />
          </div>
        </div>
      </div>

      <TaskForm
        open={showTaskForm}
        onOpenChange={setShowTaskForm}
        onSubmit={handleCreateTask}
        isLoading={createLoading}
      />

      <TaskForm
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask || undefined}
        isLoading={updateLoading}
      />

      <TaskDetail
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </main>
  );
};
