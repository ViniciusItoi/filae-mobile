/**
 * Notification Types
 * Based on Filae API - Notifications endpoints
 */

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: number;
  createdAt: string;
  readAt?: string;
}

export type NotificationType =
  | 'QUEUE_JOINED'
  | 'QUEUE_CALLED'
  | 'QUEUE_POSITION_UPDATE'
  | 'QUEUE_CANCELLED'
  | 'QUEUE_FINISHED'
  | 'ESTABLISHMENT_UPDATE'
  | 'SYSTEM_ANNOUNCEMENT';

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAsReadResponse {
  message: string;
}

