/**
 * User Service
 * Handles user profile operations
 */

import ApiClient from '../api/client';
import API_CONFIG from '../config/api.config';
import {
  User,
  UpdateProfileRequest,
  UpdateProfileResponse,
  HealthCheckResponse,
  SystemStatsResponse,
} from '../types';
import AuthService from './auth.service';

class UserService {
  /**
   * Get current user profile
   */
  async getMyProfile(): Promise<User> {
    const response = await ApiClient.getClient().get<User>(
      API_CONFIG.ENDPOINTS.USER_ME
    );

    // Update user in storage
    await AuthService.updateCurrentUser(response.data);

    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<User> {
    const response = await ApiClient.getClient().get<User>(
      API_CONFIG.ENDPOINTS.USER_BY_ID(userId)
    );

    return response.data;
  }

  /**
   * Update current user profile
   */
  async updateMyProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await ApiClient.getClient().put<UpdateProfileResponse>(
      API_CONFIG.ENDPOINTS.USER_ME,
      data
    );

    // Update user in storage
    await AuthService.updateCurrentUser(response.data.user);

    return response.data;
  }

  /**
   * Update user by ID (admin only)
   */
  async updateUserById(
    userId: number,
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    const response = await ApiClient.getClient().put<UpdateProfileResponse>(
      API_CONFIG.ENDPOINTS.USER_BY_ID(userId),
      data
    );

    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await ApiClient.getClient().get<HealthCheckResponse>(
      API_CONFIG.ENDPOINTS.HEALTH
    );

    return response.data;
  }

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStatsResponse> {
    const response = await ApiClient.getClient().get<SystemStatsResponse>(
      API_CONFIG.ENDPOINTS.HEALTH_STATS
    );

    return response.data;
  }
}

export default new UserService();

