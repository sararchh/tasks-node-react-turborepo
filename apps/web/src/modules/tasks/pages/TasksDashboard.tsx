import React, { useState, useMemo } from "react";
import { Plus, AlertCircle, LogOut, User } from "lucide-react";
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
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Task, TaskQueryDto, TaskStatus } from "../types/task.types";

export const TasksDashboard: React.FC = () => {
  const [filters, setFilters] = useState<TaskQueryDto>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { user, logout } = useAuth();

  const {
    data: tasksData,
    isLoading,
    error,
  } = useGetTasks({
    ...filters,
    page: 1,
    size: 100, // Carregar mais tarefas para o Kanban
  });

  const tasks = useMemo(() => tasksData?.tasks || [], [tasksData?.tasks]);
  const total = tasksData?.total || 0;

  const { createTask, isLoading: createLoading } = useCreateTask();
  const { updateTask, isLoading: updateLoading } = useUpdateTask();
  const { deleteTask, isLoading: deleteLoading } = useDeleteTask();

  const handleCreateTask = (data: any) => {
    createTask(data, {
      onSuccess: () => {
        setShowTaskForm(false);
      },
    });
  };

  const handleUpdateTask = (data: any) => {
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
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      deleteTask(taskId, {
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
    updateTask(
      { id: taskId, data: { status: newStatus } },
      {
        onSuccess: () => {
          // Task moved successfully
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 !px-4">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                iGame Tasks
              </h1>
            </div>

            <div className="flex items-center space-x-4 gap-4">
              <div className="flex items-center space-x-2">
                <User size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user?.username || user?.email || "Usuário"}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 h-full">
        <div className=" sm:px-6 !m-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !mb-4 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Gerenciamento de Tarefas
              </h2>
              <p className="text-gray-600 mt-1">
                {total > 0
                  ? `${total} tarefa${total !== 1 ? "s" : ""} encontrada${total !== 1 ? "s" : ""}`
                  : "Nenhuma tarefa encontrada"}
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

          {/* Content */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <TaskFilters
                onFiltersChange={handleFiltersChange}
                loading={isLoading}
              />
            </div>

            {/* Kanban Board */}
            {error ? (
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
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[70vh]">
                <KanbanBoard
                  tasks={tasks}
                  onTaskMove={handleTaskMove}
                  onTaskEdit={handleEditTask}
                  onTaskDelete={handleDeleteTask}
                  onTaskView={handleViewTask}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
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
    </div>
  );
};
