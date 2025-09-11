import { X, CheckCheck } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Button } from '../../../components/ui/button';
import {
  useGetUserNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification
} from '../hooks';
import { useCallback, useMemo } from 'react';

interface NotificationPanelProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onRefresh?: () => void;
}

export const NotificationPanel = ({
  userId,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onRefresh,
}: NotificationPanelProps) => {
  const {
    data: notifications = [],
    isLoading,
    error
  } = useGetUserNotifications(userId);

  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead } = useMarkAllAsRead();
  const { deleteNotification } = useDeleteNotification();

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      await markAsRead({ notificationId });
      onMarkAsRead?.(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [markAsRead, onMarkAsRead]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead({ userId });
      onMarkAllAsRead?.();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [markAllAsRead, userId, onMarkAllAsRead]);

  const handleDelete = useCallback(async (notificationId: string) => {
    try {
      await deleteNotification({ notificationId });
      onRefresh?.();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [deleteNotification, onRefresh]);

  const unreadCount = useMemo(() =>
    notifications.filter(n => n.status === 'UNREAD').length,
    [notifications]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Notificações
          </h2>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="h-full overflow-y-auto pb-16 flex flex-col gap-5 !p-2">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-gray-500">Carregando notificações...</div>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-red-600">
                {error instanceof Error ? error.message : 'Erro ao carregar notificações'}
              </div>
            </div>
          )}

          {notifications.length === 0 && !isLoading && !error && (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-gray-500">Nenhuma notificação encontrada</div>
            </div>
          )}

          {notifications.length > 0 && (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};
