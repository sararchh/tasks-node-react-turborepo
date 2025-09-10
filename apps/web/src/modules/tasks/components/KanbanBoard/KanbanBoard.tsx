import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { TaskStatus } from "../../types/task.types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { getAllStatusColumns, STATUS_CONFIG } from "../../utils/task-configs";

interface KanbanBoardProps {
  tasks: any[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskEdit: (task: any) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskView: (task: any) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  onTaskView,
}) => {
  const [activeTask, setActiveTask] = React.useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const columns = getAllStatusColumns().map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    if (newStatus && Object.values(TaskStatus).includes(newStatus)) {
      onTaskMove(taskId, newStatus);
    }

    setActiveTask(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    if (Object.values(TaskStatus).includes(overId as TaskStatus)) {
      const newStatus = overId as TaskStatus;
      onTaskMove(taskId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="p-6 h-full">
        <div className="lg:grid lg:grid-cols-4 gap-6 h-full  md:grid md:grid-cols-2 space-y-6 ">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              headerColor={column.headerColor}
              tasks={column.tasks}
              onTaskEdit={onTaskEdit}
              onTaskDelete={onTaskDelete}
              onTaskView={onTaskView}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              onView={() => {}}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
