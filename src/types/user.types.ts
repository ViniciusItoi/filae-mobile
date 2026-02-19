/**
 * User/Profile Types
 * Based on Filae API - User Management endpoints
 */

import { User } from './auth.types';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profilePictureUrl?: string;
}

export interface UpdateProfileResponse {
  user: User;
  message: string;
}

export interface HealthCheckResponse {
  status: 'UP' | 'DOWN';
  service: string;
  version: string;
  timestamp: number;
}

export interface SystemStatsResponse {
  totalUsers: number;
  totalEstablishments: number;
  totalQueues: number;
  totalNotifications: number;
  totalFavorites: number;
  timestamp: string;
}

