import React from "react";
import { useForm } from "react-hook-form";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TaskPriority, TaskStatus } from "../../types/task.types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../../utils/task-configs";

interface TaskFiltersData {
  search?: string;
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
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
    },
  });

  const handleClearFilters = () => {
    reset();
    onFiltersChange({});
  };

  const handleFilterChange = React.useCallback(
    (data: TaskFiltersData) => {
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== "" && value !== false && value !== undefined) {
          acc[key as keyof TaskFiltersData] = value;
        }
        return acc;
      }, {} as TaskFiltersData);

      onFiltersChange(cleanData);
    },
    [onFiltersChange],
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
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🔍 Pesquisar Tarefas
          </label>
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
            <label className="flex items-center text-sm font-medium text-gray-700">
              📊 Status
            </label>
            <div className="relative">
              <select
                {...register("status")}
                className="w-full h-12 px-4 border-2 border-gray-200 !rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white shadow-sm transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">Todos os status</option>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              🚨 Prioridade
            </label>
            <div className="relative">
              <select
                {...register("priority")}
                className="w-full h-12 px-4 border-2 border-gray-200 !rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white shadow-sm transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">Todas as prioridades</option>
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
