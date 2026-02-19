/**
 * Health Check Types
 */

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  timestamp?: string;
}

export interface SystemStatsResponse {
  totalUsers: number;
  totalEstablishments: number;
  totalQueues: number;
  activeQueues: number;
}

