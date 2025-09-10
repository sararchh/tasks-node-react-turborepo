import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Edit,
  Trash2,
  Users,
  MessageCircle,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, TaskPriority, TaskStatus } from "../../types/task.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onView: (task: Task) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onView,
  isDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return "bg-red-100 text-red-800 border-red-200";
      case TaskPriority.HIGH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case TaskPriority.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case TaskPriority.LOW:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return <AlertTriangle size={14} />;
      case TaskPriority.HIGH:
        return <Clock size={14} />;
      default:
        return null;
    }
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-move !p-4
        ${isDragging || isSortableDragging ? "opacity-50 rotate-2 shadow-lg" : ""}
        ${isOverdue ? "border-red-300 bg-red-50" : ""}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onView(task);
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="!font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1 mr-2">
            {task.title}
          </h4>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <Edit size={12} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}>
            <div className="flex items-center gap-1">
              {getPriorityIcon(task.priority)}
              {task.priority}
            </div>
          </Badge>
        </div>

        {task.deadline && (
          <div
            className={`flex items-center gap-1 text-xs mb-3 ${
              isOverdue ? "text-red-600" : "text-gray-500"
            }`}
          >
            <Calendar size={12} />
            <span>
              {format(new Date(task.deadline), "dd/MM/yyyy", { locale: ptBR })}
            </span>
            {isOverdue && (
              <span className="text-red-500 font-medium">(Atrasado)</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            {task.assignments && task.assignments.length > 0 && (
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{task.assignments.length}</span>
              </div>
            )}

            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle size={12} />
                <span>{task.comments.length}</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400">
            {format(new Date(task.createdAt), "dd/MM", { locale: ptBR })}
          </div>
        </div>
      </div>
    </div>
  );
};
