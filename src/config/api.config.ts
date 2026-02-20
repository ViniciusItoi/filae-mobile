/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

import ENV_CONFIG from './env.config';

/**
 * Get the correct base URL based on platform and environment
 * Backend is running at: http://localhost:8080
 *
 * Android Emulator: Use 10.0.2.2 (maps to host machine's localhost)
 * iOS Simulator: Use localhost directly
 * Physical Device: Use your machine's IP address (set in env.config.ts)
 */
const getBaseUrl = () => {
  if (!__DEV__) {
    // Production
    return 'https://api.filae.com';
  }

  // Development - Backend at localhost:8080
  const { PHYSICAL_DEVICE_IP, BACKEND_PORT, API_PREFIX } = ENV_CONFIG;

  if (PHYSICAL_DEVICE_IP) {
    // Physical device - use machine's IP
    return `http://${PHYSICAL_DEVICE_IP}:${BACKEND_PORT}${API_PREFIX}`;
  }

  // Android Emulator (10.0.2.2 = localhost on host machine)
  // For iOS Simulator, change to 'http://localhost:8080'
  return `http://10.0.2.2:${BACKEND_PORT}${API_PREFIX}`;
};

export const API_CONFIG = {
  // Base URL - Automatically configured
  BASE_URL: getBaseUrl(),

  // Timeout settings
  TIMEOUT: 30000, // 30 seconds

  // Token storage key
  TOKEN_KEY: '@filae:token',
  USER_KEY: '@filae:user',

  // API Version
  VERSION: '1.0.0',

  // Endpoints
  ENDPOINTS: {
    // Health
    HEALTH: '/health',
    HEALTH_STATS: '/health/stats',

    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',

    // Users
    USER_ME: '/users/me',
    USER_BY_ID: (id: number) => `/users/${id}`,

    // Establishments
    ESTABLISHMENTS: '/establishments',
    ESTABLISHMENT_BY_ID: (id: number) => `/establishments/${id}`,

    // Favorites
    FAVORITES: '/favorites',
    FAVORITE_CHECK: (establishmentId: number) => `/favorites/check/${establishmentId}`,
    FAVORITE_BY_ID: (id: number) => `/favorites/${id}`,

    // Notifications
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_UNREAD_COUNT: '/notifications/unread/count',
    NOTIFICATION_READ: (id: number) => `/notifications/${id}/read`,
    NOTIFICATION_READ_ALL: '/notifications/read-all',
    NOTIFICATION_DELETE: (id: number) => `/notifications/${id}`,

    // Queues
    QUEUES_MY: '/queues/my-queues',
    QUEUE_BY_ID: (id: number) => `/queues/${id}`,
    QUEUE_JOIN: '/queues/join',
    QUEUE_UPDATE: (id: number) => `/queues/${id}`,
    QUEUE_CANCEL: (id: number) => `/queues/${id}/cancel`,
    QUEUE_BY_ESTABLISHMENT: (establishmentId: number) => `/queues/establishment/${establishmentId}`,
    QUEUE_CALL_NEXT: (establishmentId: number) => `/queues/establishment/${establishmentId}/call-next`,
    QUEUE_FINISH: (id: number) => `/queues/${id}/finish`,

    // Merchant Queue Management
    QUEUES_MERCHANT_ALL: '/queues/merchant/all',
    QUEUES_MERCHANT_ACTIVE: '/queues/merchant/active',
    QUEUES_MERCHANT_BY_ESTABLISHMENT: (establishmentId: number) => `/queues/merchant/establishment/${establishmentId}`,
    QUEUES_MERCHANT_STATS: '/queues/merchant/stats',
  },
} as const;

export default API_CONFIG;

