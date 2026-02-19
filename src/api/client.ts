/**
 * API Client
 * Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import API_CONFIG from '../config/api.config';
import StorageService from '../utils/storage';
import { ApiError } from '../types';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Get token from storage if not in memory
        if (!this.token) {
          this.token = await StorageService.getItem<string>(API_CONFIG.TOKEN_KEY);
        }

        // Add Authorization header if token exists
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Log request in development
        if (__DEV__) {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (__DEV__) {
          console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        // Handle error responses
        const apiError = this.handleError(error);

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
          await this.clearAuth();
          // You can trigger a logout event here
          console.log('🔒 Unauthorized - Clearing auth');
        }

        console.error('❌ API Error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Handle and format API errors
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error
      const data = error.response.data as any;
      return {
        message: data?.message || 'An error occurred',
        status: error.response.status,
        errors: data?.errors,
        timestamp: data?.timestamp || new Date().toISOString(),
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your internet connection.',
        status: 0,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Set authentication token
   */
  async setToken(token: string): Promise<void> {
    this.token = token;
    await StorageService.setItem(API_CONFIG.TOKEN_KEY, token);
  }

  /**
   * Get authentication token
   */
  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await StorageService.getItem<string>(API_CONFIG.TOKEN_KEY);
    }
    return this.token;
  }

  /**
   * Clear authentication
   */
  async clearAuth(): Promise<void> {
    this.token = null;
    await StorageService.removeItem(API_CONFIG.TOKEN_KEY);
    await StorageService.removeItem(API_CONFIG.USER_KEY);
  }

  /**
   * Get the axios instance
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

export default new ApiClient();

