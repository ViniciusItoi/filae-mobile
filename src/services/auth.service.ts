/**
 * Authentication Service
 * Handles user authentication operations
 */

import ApiClient from '../api/client';
import API_CONFIG from '../config/api.config';
import StorageService from '../utils/storage';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../types';

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await ApiClient.getClient().post<LoginResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    );

    const loginData = response.data;
    console.log('🔍 Login response data:', loginData);

    // Extract token
    const { token, type, userId, email, name, userType } = loginData;

    if (!token) {
      throw new Error('Token não encontrado na resposta da API');
    }

    // Save token
    await ApiClient.setToken(token);

    // Convert login response to User object for storage
    const user: User = {
      id: userId,
      name,
      email,
      phone: '', // Will be filled from /users/me if needed
      userType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('💾 Saving user to storage:', user);
    await StorageService.setItem(API_CONFIG.USER_KEY, user);

    return loginData;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await ApiClient.getClient().post<RegisterResponse>(
      API_CONFIG.ENDPOINTS.REGISTER,
      userData
    );

    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await ApiClient.clearAuth();
  }

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<User | null> {
    return await StorageService.getItem<User>(API_CONFIG.USER_KEY);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await ApiClient.getToken();
    return token !== null;
  }

  /**
   * Update current user in storage
   */
  async updateCurrentUser(user: User): Promise<void> {
    await StorageService.setItem(API_CONFIG.USER_KEY, user);
  }
}

export default new AuthService();

