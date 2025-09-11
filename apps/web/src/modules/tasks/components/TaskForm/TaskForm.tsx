import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Edit,
  Plus,
  Calendar,
  Flag,
  Users,
  FileText,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskPriority, TaskStatus, Task } from "../../types/task.types";
import { useGetUsers } from "../../hooks/useGetUsers";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../../utils/task-configs";

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
  const isEditing = useMemo(() => !!task, [task]);
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
      title: task?.title || "",
      description: task?.description || "",
      deadline: task?.deadline ? task.deadline.split("T")[0] : "",
      priority: task?.priority || TaskPriority.MEDIUM,
      status: task?.status || TaskStatus.TODO,
      assignedUserIds: task?.assignments?.map((a) => a.userId) || [],
    },
  });

  const selectedUserIds = React.useMemo(() => {
    return watch("assignedUserIds") || [];
  }, [watch("assignedUserIds")]);

  React.useEffect(() => {
    if (task && isEditing) {
      reset({
        title: task.title,
        description: task.description,
        deadline: task.deadline ? task.deadline.split("T")[0] : "",
        priority: task.priority,
        status: task.status,
        assignedUserIds: task.assignments.map((a) => a.userId),
      });
    }
  }, [task, isEditing, reset]);

  const handleFormSubmit = useCallback(
    (data: TaskFormData) => {
      if (!isEditing) {
        delete data.status;
      }

      if (data.assignedUserIds && data.assignedUserIds.length > 0) {
        data.assignedUsers = data.assignedUserIds.map((userId) => {
          const user = users.find((u) => u.id === userId);
          return {
            id: userId,
            username: user?.username || user?.email || "Unknown User",
          };
        });
      }

      onSubmit(data);
      if (!isEditing) {
        reset();
      }
    },
    [isEditing, users, onSubmit, reset],
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
    if (!isEditing) {
      reset();
    }
  }, [isEditing, onOpenChange, reset]);

  const toggleUserAssignment = useCallback(
    (userId: string) => {
      const currentIds = selectedUserIds;
      const newIds = currentIds.includes(userId)
        ? currentIds.filter((id) => id !== userId)
        : [...currentIds, userId];
      setValue("assignedUserIds", newIds);
    },
    [selectedUserIds, setValue],
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 gap-0">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="flex-shrink-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200 !p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                {isEditing ? (
                  <Edit className="w-5 h-5 text-white" />
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl !font-bold text-slate-900">
                  {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
                </DialogTitle>
                <p className="text-sm text-slate-600 mt-1">
                  {isEditing
                    ? "Atualize as informações da tarefa"
                    : "Preencha os dados para criar uma nova tarefa"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto !p-4 bg-slate-50/30">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="max-w-5xl mx-auto space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm !mb-4 !p-4">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg text-slate-900">
                      <FileText className="w-5 h-5 !mr-2 text-slate-600" />
                      Informações Básicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="!space-y-2">
                      <div className="!space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-slate-700 font-medium"
                        >
                          Título*
                        </Label>
                        <Input
                          id="title"
                          {...register("title", {
                            required: "Título é obrigatório",
                            minLength: {
                              value: 3,
                              message:
                                "Título deve ter pelo menos 3 caracteres",
                            },
                          })}
                          placeholder="Digite o título da tarefa..."
                          className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                            errors.title
                              ? "border-red-300 focus:border-red-500"
                              : ""
                          }`}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div className="!space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-slate-700 font-medium"
                        >
                          Descrição*
                        </Label>
                        <Textarea
                          id="description"
                          {...register("description", {
                            required: "Descrição é obrigatória",
                            minLength: {
                              value: 10,
                              message:
                                "Descrição deve ter pelo menos 10 caracteres",
                            },
                          })}
                          placeholder="Descreva a tarefa detalhadamente..."
                          rows={4}
                          className={`resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                            errors.description
                              ? "border-red-300 focus:border-red-500"
                              : ""
                          }`}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm !mb-4 !p-4">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg text-slate-900">
                      <Flag className="w-5 h-5 !mr-2 text-slate-600" />
                      Configurações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="!space-y-4">
                      <div className="!space-y-2">
                        <Label
                          htmlFor="deadline"
                          className="text-slate-700 font-medium flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Prazo
                        </Label>
                        <Input
                          id="deadline"
                          type="date"
                          {...register("deadline")}
                          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="priority"
                          className="text-slate-700 font-medium flex items-center gap-2 !mb-1"
                        >
                          <Flag className="w-4 h-4" />
                          Prioridade
                        </Label>
                        <Select
                          id="priority"
                          {...register("priority")}
                          className="border-slate-200"
                        >
                          {Object.entries(PRIORITY_CONFIG).map(
                            ([key, config]) => (
                              <option key={key} value={key}>
                                {config.label}
                              </option>
                            ),
                          )}
                        </Select>
                      </div>

                      {isEditing && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="status"
                            className="text-slate-700 font-medium flex items-center gap-2"
                          >
                            <Clock className="w-4 h-4" />
                            Status
                          </Label>
                          <Select
                            id="status"
                            {...register("status")}
                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          >
                            {Object.entries(STATUS_CONFIG).map(
                              ([key, config]) => (
                                <option key={key} value={key}>
                                  {config.label}
                                </option>
                              ),
                            )}
                          </Select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-slate-200 shadow-sm !mb-4 !p-4">
                <CardHeader className="!pb-4">
                  <CardTitle className="flex items-center text-lg text-slate-900">
                    <Users className="w-5 h-5 !mr-2 text-slate-600" />
                    Atribuir Usuários ({selectedUserIds.length} selecionados)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border border-slate-200 rounded-lg !p-4 max-h-48 overflow-y-auto bg-white">
                    {users.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">
                          Nenhum usuário disponível
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {users.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center gap-3 cursor-pointer !p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={selectedUserIds.includes(user.id)}
                              onChange={() => toggleUserAssignment(user.id)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {user.username}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          <div className="flex-shrink-0 bg-white border-t border-slate-200 !p-4">
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
                className="border border-slate-200 hover:bg-slate-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit(handleFormSubmit)}
                isLoading={isLoading}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm min-w-[120px]"
              >
                {isEditing ? "✏️ Atualizar" : "➕ Criar"} Tarefa
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
