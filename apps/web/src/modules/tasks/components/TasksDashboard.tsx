import React from "react";
import { TasksHeader } from "./TasksHeader";
import { TasksMain } from "./TasksMain";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export const TasksDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TasksHeader user={user} onLogout={logout} />
      <TasksMain user={user} />
    </div>
  );
};
