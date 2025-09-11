import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { X, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TaskPriority, TaskStatus } from "../../types/task.types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../../utils/task-configs";

interface TaskFiltersData {
  search?: string;
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  assignedToMe?: boolean;
}

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFiltersData) => void;
  loading?: boolean;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFiltersChange,
  loading = false,
}) => {
  const { register, reset, watch } = useForm<TaskFiltersData>({
    defaultValues: {
      search: "",
      status: "",
      priority: "",
      assignedToMe: false,
    },
  });

  const handleClearFilters = useCallback(() => {
    reset();
    onFiltersChange({});
  }, [reset, onFiltersChange]);

  const handleFilterChange = useCallback(
    (data: TaskFiltersData) => {
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (typeof value === 'boolean' && value === true) {
          (acc as any)[key] = value;
        }
        else if (typeof value === 'string' && value !== "" && value !== undefined) {
          (acc as any)[key] = value;
        }
        return acc;
      }, {} as TaskFiltersData);

      onFiltersChange(cleanData);
    },
    [onFiltersChange],
  );

  const statusOptions = useMemo(() =>
    Object.entries(STATUS_CONFIG).map(([key, config]) => ({
      value: key,
      label: config.label
    })),
    []
  );

  const priorityOptions = useMemo(() =>
    Object.entries(PRIORITY_CONFIG).map(([key, config]) => ({
      value: key,
      label: config.label
    })),
    []
  );

  React.useEffect(() => {
    const subscription = watch((value) => {
      handleFilterChange(value as TaskFiltersData);
    });
    return () => subscription.unsubscribe();
  }, [watch, handleFilterChange]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 !p-4 rounded-xl border border-gray-200 shadow-sm !mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
        <div>
          <p className="text-sm text-gray-600 mt-1">
            Encontre suas tarefas rapidamente
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300 hover:border-red-300 transition-all duration-200 self-start sm:self-auto"
        >
          <X size={16} className="mr-2" />
          Limpar Filtros
        </Button>
      </div>

      <form className="space-y-6">
        <div className="relative">
          <Label className="block text-sm font-medium text-gray-700 mb-3">
            🔍 Pesquisar Tarefas
          </Label>
          <div className="relative group">
            <Input
              {...register("search")}
              placeholder="Digite o título, descrição ou responsável..."
              className="w-full pl-12 pr-4 h-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white shadow-sm transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 !mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium text-gray-700">
              📊 Status
            </Label>
            <Select
              {...register("status")}
              className="w-full h-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white shadow-sm transition-all duration-200 text-gray-900"
            >
              <option value="">Todos os status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium text-gray-700">
              🚨 Prioridade
            </Label>
            <Select
              {...register("priority")}
              className="w-full h-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white shadow-sm transition-all duration-200 text-gray-900"
            >
              <option value="">Todas as prioridades</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register("assignedToMe")}
              id="assignedToMe"
              className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
            />
            <Label
              htmlFor="assignedToMe"
              className="flex items-center text-sm font-medium text-gray-700 cursor-pointer"
            >
              <User size={16} className="mr-2 text-blue-600" />
              Minhas Tarefas
            </Label>
          </div>
        </div>
      </form>
    </div>
  );
};
