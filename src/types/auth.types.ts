/**
 * Authentication Types
 * Based on Filae API - Authentication endpoints
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  name: string;
  userType: UserType;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: UserType;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export type UserType = 'CUSTOMER' | 'MERCHANT' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

