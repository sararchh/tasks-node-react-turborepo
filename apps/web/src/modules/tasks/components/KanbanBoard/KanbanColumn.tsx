import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskStatus } from "../../types/task.types";
import { TaskCard } from "./TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  headerColor: string;
  tasks: any[];
  onTaskEdit: (task: any) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskView: (task: any) => void;
  isFetching?: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  headerColor,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onTaskView,
  isFetching = false,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col w-full h-full min-h-[500px] lg:min-h-[600px] rounded-lg border-2 transition-all duration-200
        ${color}
        ${isOver ? "border-blue-500 shadow-lg scale-105" : "border-gray-300"}
      `}
    >
      <div
        className={`
        p-4 rounded-t-lg border-b ${headerColor}
        flex items-center justify-between
      `}
      >
        <h3 className="!font-semibold text-gray-900 text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 !p-2 !space-y-3  overflow-y-auto max-h-[400px] lg:max-h-[500px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {isFetching && (
            <>
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </>
          )}

          {tasks.length === 0 && !isFetching && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">Nenhuma tarefa</p>
              <p className="text-xs text-gray-400 mt-1">
                Arraste uma tarefa aqui
              </p>
            </div>
          )}

          {tasks.length > 0 &&
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onView={onTaskView}
              />
            ))}
        </SortableContext>
      </div>
    </div>
  );
};
