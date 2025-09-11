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

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'TASK_CREATED':
      return <Plus className="h-4 w-4 text-blue-500" />;
    case 'TASK_UPDATED':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'TASK_ASSIGNED':
      return <Clock className="h-4 w-4 text-orange-500" />;
    case 'COMMENT_NEW':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getNotificationTypeLabel = (type: Notification['type']) => {
  switch (type) {
    case 'TASK_CREATED':
      return 'Tarefa Criada';
    case 'TASK_UPDATED':
      return 'Tarefa Atualizada';
    case 'TASK_ASSIGNED':
      return 'Tarefa Atribuída';
    case 'COMMENT_NEW':
      return 'Novo Comentário';
    default:
      return 'Notificação';
  }
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
      className={`flex items-start space-x-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
        notification.status === 'UNREAD' ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h4>
            <Badge variant="secondary" size="sm">
              {getNotificationTypeLabel(notification.type)}
            </Badge>
          </div>
          
          {notification.status === 'UNREAD' && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
          )}
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          {notification.message}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
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
                className="text-xs"
              >
                Marcar como lida
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              isLoading={isLoading}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
