/**
 * Establishment Types
 * Based on Filae API - Establishments endpoints
 */

export interface Establishment {
  id: number;
  name: string;
  description: string;
  category: EstablishmentCategory;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  websiteUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  isAcceptingCustomers: boolean;
  queueEnabled: boolean;
  averageServiceTime: number; // minutes
  maxCapacity: number;
  currentQueueSize: number;
  estimatedWaitTime: number; // minutes
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: OpeningHours[];
  merchantId: number;
  createdAt: string;
  updatedAt: string;
}

export type EstablishmentCategory =
  | 'restaurant'
  | 'cafe'
  | 'clinic'
  | 'salon'
  | 'barber'
  | 'bank'
  | 'cinema'
  | 'store'
  | 'other';

export interface OpeningHours {
  id: number;
  dayOfWeek: DayOfWeek;
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  isClosed: boolean;
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface EstablishmentListResponse {
  establishments: Establishment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EstablishmentFilterParams {
  category?: EstablishmentCategory;
  city?: string;
  name?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

