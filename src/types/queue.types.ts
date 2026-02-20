/**
 * Queue Types
 * Based on Filae API - Queue endpoints
 */

export interface Queue {
  id: number;
  ticketNumber: string;
  establishmentId: number;
  establishmentName: string;
  userId: number;
  userName: string;
  status: QueueStatus;
  position: number;
  partySize: number;
  estimatedWaitTime: number; // minutes
  joinedAt: string;
  calledAt?: string;
  finishedAt?: string;
  cancelledAt?: string;
  notes?: string;
}

export type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'FINISHED'
  | 'CANCELLED';

export interface JoinQueueRequest {
  establishmentId: number;
  partySize: number;
  notes?: string;
}

export interface UpdateQueueRequest {
  partySize?: number;
  notes?: string;
}

export interface JoinQueueResponse {
  queue: Queue;
  message: string;
}

export interface QueuePositionResponse {
  queue: Queue;
  position: number;
  totalAhead: number;
  estimatedWaitTime: number;
}

export interface MyQueuesResponse {
  activeQueues: Queue[];
  historyQueues: Queue[];
}

export interface EstablishmentQueueResponse {
  establishment: {
    id: number;
    name: string;
  };
  queues: Queue[];
  totalWaiting: number;
  totalCalled: number;
  averageWaitTime: number;
}

export interface CallNextResponse {
  calledQueue: Queue;
  message: string;
}

export interface CancelQueueResponse {
  message: string;
}

export interface FinishQueueResponse {
  message: string;
}

