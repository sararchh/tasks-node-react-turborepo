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
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskStatus } from "../../types/task.types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";

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

  const columns = [
    {
      id: TaskStatus.TODO,
      title: "A Fazer",
      color: "bg-gray-100 border-gray-300",
      headerColor: "bg-gray-50",
      tasks: tasks.filter((task) => task.status === TaskStatus.TODO),
    },
    {
      id: TaskStatus.IN_PROGRESS,
      title: "Em Andamento",
      color: "bg-blue-100 border-blue-300",
      headerColor: "bg-blue-50",
      tasks: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
    },
    {
      id: TaskStatus.REVIEW,
      title: "Revisão",
      color: "bg-yellow-100 border-yellow-300",
      headerColor: "bg-yellow-50",
      tasks: tasks.filter((task) => task.status === TaskStatus.REVIEW),
    },
    {
      id: TaskStatus.DONE,
      title: "Concluído",
      color: "bg-green-100 border-green-300",
      headerColor: "bg-green-50",
      tasks: tasks.filter((task) => task.status === TaskStatus.DONE),
    },
  ];

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

    // If dropping on a column
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
      <div className="p-6">
        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6 overflow-x-auto pb-6">
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

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-6">
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
