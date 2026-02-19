/**
 * Notification Service
 * Handles notification operations
 */

import ApiClient from '../api/client';
import API_CONFIG from '../config/api.config';
import {
  Notification,
  NotificationListResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
} from '../types';

class NotificationService {
  /**
   * Get all notifications
   */
  async getNotifications(unreadOnly?: boolean): Promise<Notification[]> {
    const params = unreadOnly ? { unread: true } : undefined;

    const response = await ApiClient.getClient().get<Notification[]>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS,
      { params }
    );

    return response.data;
  }

  /**
   * Get unread notifications only
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    return this.getNotifications(true);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await ApiClient.getClient().get<UnreadCountResponse>(
      API_CONFIG.ENDPOINTS.NOTIFICATION_UNREAD_COUNT
    );

    return response.data.count;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<MarkAsReadResponse> {
    const response = await ApiClient.getClient().put<MarkAsReadResponse>(
      API_CONFIG.ENDPOINTS.NOTIFICATION_READ(notificationId)
    );

    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<MarkAsReadResponse> {
    const response = await ApiClient.getClient().put<MarkAsReadResponse>(
      API_CONFIG.ENDPOINTS.NOTIFICATION_READ_ALL
    );

    return response.data;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await ApiClient.getClient().delete(
      API_CONFIG.ENDPOINTS.NOTIFICATION_DELETE(notificationId)
    );
  }
}

export default new NotificationService();

