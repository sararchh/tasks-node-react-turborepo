import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseNotificationWebSocketProps {
  userId?: string;
  onTaskCreated?: (data: any) => void;
  onTaskUpdated?: (data: any) => void;
  onCommentNew?: (data: any) => void;
}

export const useNotificationWebSocket = ({
  userId,
  onTaskCreated,
  onTaskUpdated,
  onCommentNew,
}: UseNotificationWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const onTaskCreatedRef = useRef(onTaskCreated);
  const onTaskUpdatedRef = useRef(onTaskUpdated);
  const onCommentNewRef = useRef(onCommentNew);

  useEffect(() => {
    onTaskCreatedRef.current = onTaskCreated;
    onTaskUpdatedRef.current = onTaskUpdated;
    onCommentNewRef.current = onCommentNew;
  });

  useEffect(() => {
    if (!userId) {
      if (socketRef.current) {
        console.log('🔌 Desconectando - sem userId');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setUnreadCount(0);
      }
      return;
    }

    if (socketRef.current && socketRef.current.connected) {
      console.log('🔌 Já conectado - mantendo conexão');
      return;
    }

    console.log('🔌 Iniciando conexão WebSocket para usuário:', userId);

    const token = localStorage.getItem('accessToken');

    const socket = io(`${import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL || 'http://localhost:3004'}/notifications`, {
      transports: ['websocket'],
      upgrade: false,
      auth: {
        token: token
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Conectado ao WebSocket de notificações');
      setIsConnected(true);

      socket.emit('join', { userId });

      socket.emit('get_unread_count', { userId });
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Desconectado do WebSocket:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error);
      setIsConnected(false);
    });

    socket.on('joined', (data) => {
      console.log('🏠 Entrou na sala de notificações:', data);
    });

    socket.on('left', (data) => {
      console.log('🚪 Saiu da sala de notificações:', data);
    });

    socket.on('unread_count', (data) => {
      console.log('📊 Contagem de não lidas atualizada:', data.count);
      setUnreadCount(data.count);
    });

    socket.on('notification_read', (notification) => {
      console.log('📖 Notificação marcada como lida:', notification);
      socket.emit('get_unread_count', { userId });
    });

    socket.on('task:created', (data) => {
      console.log('📝 Nova tarefa criada:', data);
      onTaskCreatedRef.current?.(data);
      socket.emit('get_unread_count', { userId });
    });

    socket.on('task:updated', (data) => {
      console.log('✏️ Tarefa atualizada:', data);
      onTaskUpdatedRef.current?.(data);
      socket.emit('get_unread_count', { userId });
    });

    socket.on('comment:new', (data) => {
      console.log('💬 Novo comentário:', data);
      onCommentNewRef.current?.(data);
      socket.emit('get_unread_count', { userId });
    });

    socket.on('error', (error) => {
      console.error('❌ Erro no WebSocket:', error);
    });

    return () => {
      console.log('🧹 Limpando conexão WebSocket');
      if (socketRef.current) {
        socketRef.current.emit('leave', { userId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);

  const markAsRead = useCallback((notificationId: string) => {
    if (socketRef.current && isConnected) {
      console.log('📖 Marcando notificação como lida:', notificationId);
      socketRef.current.emit('mark_read', { notificationId });
    }
  }, [isConnected]);

  const getUnreadCount = useCallback(() => {
    if (socketRef.current && isConnected && userId) {
      console.log('📊 Solicitando contagem de não lidas');
      socketRef.current.emit('get_unread_count', { userId });
    }
  }, [isConnected, userId]);

  return {
    isConnected,
    unreadCount,
    markAsRead,
    getUnreadCount,
  };
};
