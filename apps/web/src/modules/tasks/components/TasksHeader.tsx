import React, { useState } from "react";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBadge, NotificationPanel, useNotificationWebSocket } from "@/modules/notifications";
import { toast } from "react-toastify";

interface TasksHeaderProps {
  user: {
    id?: string;
    username?: string;
    email?: string;
  } | null;
  onLogout: () => void;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({ user, onLogout }) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const { unreadCount, getUnreadCount } = useNotificationWebSocket({
    userId: user?.id,
    onTaskCreated: (data) => {
      toast.info(`Nova tarefa: ${data.title}`);
    },
    onTaskUpdated: (data) => {
      toast.info(`Tarefa atualizada: ${data.title}`);
    },
    onCommentNew: (data) => {
      toast.info(`Novo comentário em: ${data.taskTitle}`);
    },
  });

  const handleNotificationClick = () => {
    setIsNotificationPanelOpen(true);
  };

  const handleNotificationPanelClose = () => {
    setIsNotificationPanelOpen(false);
  };

  const handleMarkAsRead = () => {
    getUnreadCount();
  };

  const handleMarkAllAsRead = () => {
    getUnreadCount();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 !px-4">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl !font-semibold text-gray-900">
                iGame Tasks
              </h1>
            </div>

            <div className="flex items-center space-x-4 gap-4">
              {user?.id && (
                <NotificationBadge
                  count={unreadCount}
                  onClick={handleNotificationClick}
                />
              )}

              <div className="flex items-center space-x-2">
                <User size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user?.username || user?.email || "Usuário"}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {user?.id && (
        <NotificationPanel
          userId={user.id}
          isOpen={isNotificationPanelOpen}
          onClose={handleNotificationPanelClose}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRefresh={getUnreadCount}
        />
      )}
    </>
  );
};
