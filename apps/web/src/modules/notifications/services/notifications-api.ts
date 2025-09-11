import { api } from '../../../shared/infra/api';
import { 
  Notification, 
  NotificationQueryDto, 
  PaginatedNotificationResponse,
  UnreadCountResponse 
} from '../types';

const NOTIFICATIONS_BASE_URL = '/notifications';

export const notificationsApi = {
  getNotifications: async (params?: NotificationQueryDto): Promise<PaginatedNotificationResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const url = searchParams.toString() 
      ? `${NOTIFICATIONS_BASE_URL}?${searchParams.toString()}`
      : NOTIFICATIONS_BASE_URL;

    const response = await api.get<PaginatedNotificationResponse>(url);
    return response.data;
  },

  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await api.get<Notification[]>(`${NOTIFICATIONS_BASE_URL}/user/${userId}`);
    return response.data;
  },

  getUnreadCount: async (userId: string): Promise<UnreadCountResponse> => {
    const response = await api.get<UnreadCountResponse>(
      `${NOTIFICATIONS_BASE_URL}/user/${userId}/unread-count`
    );
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await api.put<Notification>(
      `${NOTIFICATIONS_BASE_URL}/${notificationId}/mark-read`
    );
    return response.data;
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await api.put(`${NOTIFICATIONS_BASE_URL}/user/${userId}/mark-all-read`);
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`${NOTIFICATIONS_BASE_URL}/${notificationId}`);
  },
};
