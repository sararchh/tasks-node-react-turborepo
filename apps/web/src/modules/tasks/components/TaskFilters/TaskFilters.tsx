import React from "react";
import { useForm } from "react-hook-form";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TaskPriority, TaskStatus } from "../../types/task.types";

interface TaskFiltersData {
  search?: string;
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  assignedToMe?: boolean;
  createdByMe?: boolean;
}

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFiltersData) => void;
  loading?: boolean;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFiltersChange,
  loading = false,
}) => {
  const { register, handleSubmit, reset, watch } = useForm<TaskFiltersData>({
    defaultValues: {
      search: "",
      status: "",
      priority: "",
      assignedToMe: false,
      createdByMe: false,
    },
  });

  const handleFilterSubmit = (data: TaskFiltersData) => {
    // Remove empty values
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== "" && value !== false && value !== undefined) {
        acc[key as keyof TaskFiltersData] = value;
      }
      return acc;
    }, {} as TaskFiltersData);

    onFiltersChange(cleanData);
  };

  const handleClearFilters = () => {
    reset();
    onFiltersChange({});
  };

  // Watch for changes and auto-submit
  const watchedValues = watch();

  const handleFilterChange = React.useCallback(
    (data: TaskFiltersData) => {
      // Remove empty values
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
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Filtros</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={16} className="mr-1" />
          Limpar
        </Button>
      </div>

      <form className="space-y-4">
        {/* Search */}
        <div>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              {...register("search")}
              placeholder="Pesquisar tarefas..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select {...register("status")}>
              <option value="">Todos os status</option>
              <option value={TaskStatus.TODO}>A Fazer</option>
              <option value={TaskStatus.IN_PROGRESS}>Em Progresso</option>
              <option value={TaskStatus.REVIEW}>Em Revisão</option>
              <option value={TaskStatus.DONE}>Concluído</option>
            </Select>
          </div>

          <div>
            <Select {...register("priority")}>
              <option value="">Todas as prioridades</option>
              <option value={TaskPriority.LOW}>Baixa</option>
              <option value={TaskPriority.MEDIUM}>Média</option>
              <option value={TaskPriority.HIGH}>Alta</option>
              <option value={TaskPriority.URGENT}>Urgente</option>
            </Select>
          </div>
        </div>
      </form>
    </div>
  );
};
