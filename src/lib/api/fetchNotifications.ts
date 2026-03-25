import type { operations } from '@/shared/types/api/schemas/api.types';
import { apiRequest } from './utils';

export type NotificationsResponse = operations['getList_4']['responses'][200]['content']['application/json'];
export type NotificationResponse = operations['markAsRead']['responses'][200]['content']['application/json'];

export const getNotifications = () =>
  apiRequest<NotificationsResponse>('/api/v1/notifications');

export const patchNotificationRead = (notificationId: number) =>
  apiRequest<NotificationResponse>(`/api/v1/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
