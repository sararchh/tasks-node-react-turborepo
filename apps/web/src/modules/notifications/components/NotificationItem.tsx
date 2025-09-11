import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, Clock, MessageSquare, Plus } from 'lucide-react';
import { Notification } from '../types';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getNotificationDetails = (type: Notification['type']) => {
  switch (type) {
    case 'TASK_CREATED':
      return { icon: <Plus className="h-4 w-4 text-blue-500" />, label: 'Criada' };
    case 'TASK_UPDATED':
      return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'Atualizada' };
    case 'TASK_ASSIGNED':
      return { icon: <Clock className="h-4 w-4 text-orange-500" />, label: 'Atribuída' };
    case 'COMMENT_NEW':
      return { icon: <MessageSquare className="h-4 w-4 text-purple-500" />, label: 'Novo Comentário' };
    default:
      return { icon: <Clock className="h-4 w-4 text-gray-500" />, label: 'Notificação' };
  }
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { icon, label } = getNotificationDetails(notification.type);

  const handleMarkAsRead = async () => {
    if (notification.status === 'READ') return;

    setIsLoading(true);
    try {
      await onMarkAsRead?.(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete?.(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-start !space-x-4 !p-2 !border-b !border-gray-200 hover:!bg-gray-100 !transition-all !duration-200 !rounded-lg !shadow-sm ${
        notification.status === 'UNREAD' ? '!bg-blue-50 !border-l-4 !border-l-blue-500' : ''
      }`}
    >
      <div className="!flex-shrink-0 !mt-1 !p-2 !rounded-full !bg-gray-100 !border !border-gray-200">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center !space-x-2 justify-between w-full">
            <h4 className="!text-sm !font-semibold !text-gray-900">
              {notification.title}
            </h4>
            <Badge variant="secondary" size="sm">
              {label}
            </Badge>
          </div>

          {notification.status === 'UNREAD' && (
            <div className="!w-2 !h-2 !bg-blue-500 !rounded-full !flex-shrink-0 !animate-pulse" />
          )}
        </div>

        <p className="!text-sm !text-gray-700 !mt-2 !leading-relaxed">
          {notification.message}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="!text-xs !text-gray-500 !font-medium">
            {format(new Date(notification.createdAt), "dd 'de' MMM 'às' HH:mm", {
              locale: ptBR,
            })}
          </span>

          <div className="flex items-center space-x-2">
            {notification.status === 'UNREAD' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                isLoading={isLoading}
                className="!text-xs"
              >
                Marcar como lida
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              isLoading={isLoading}
              className="!text-xs !text-red-600 hover:!text-red-700"
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
