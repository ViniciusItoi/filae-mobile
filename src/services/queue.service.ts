/**
 * Queue Service
 * Handles queue management operations
 */

import ApiClient from '../api/client';
import API_CONFIG from '../config/api.config';
import {
  Queue,
  JoinQueueRequest,
  JoinQueueResponse,
  QueuePositionResponse,
  MyQueuesResponse,
  EstablishmentQueueResponse,
  CallNextResponse,
  CancelQueueResponse,
  FinishQueueResponse,
} from '../types';

class QueueService {
  /**
   * Get my active and history queues
   */
  async getMyQueues(): Promise<MyQueuesResponse> {
    const response = await ApiClient.getClient().get<MyQueuesResponse>(
      API_CONFIG.ENDPOINTS.QUEUES_MY
    );

    return response.data;
  }

  /**
   * Get queue details by ID
   */
  async getQueueById(queueId: number): Promise<Queue> {
    const response = await ApiClient.getClient().get<Queue>(
      API_CONFIG.ENDPOINTS.QUEUE_BY_ID(queueId)
    );

    return response.data;
  }

  /**
   * Get queue position and details
   */
  async getQueuePosition(queueId: number): Promise<QueuePositionResponse> {
    const response = await ApiClient.getClient().get<QueuePositionResponse>(
      API_CONFIG.ENDPOINTS.QUEUE_BY_ID(queueId)
    );

    // Transform to QueuePositionResponse format
    const queue = response.data as any;
    return {
      queue: queue,
      position: queue.position,
      totalAhead: queue.position - 1,
      estimatedWaitTime: queue.estimatedWaitTime,
    };
  }

  /**
   * Join a queue
   */
  async joinQueue(data: JoinQueueRequest): Promise<JoinQueueResponse> {
    const response = await ApiClient.getClient().post<JoinQueueResponse>(
      API_CONFIG.ENDPOINTS.QUEUE_JOIN,
      data
    );

    return response.data;
  }

  /**
   * Cancel queue entry
   */
  async cancelQueue(queueId: number): Promise<CancelQueueResponse> {
    const response = await ApiClient.getClient().put<CancelQueueResponse>(
      API_CONFIG.ENDPOINTS.QUEUE_CANCEL(queueId)
    );

    return response.data;
  }

  /**
   * Get establishment's queue (merchant only)
   */
  async getEstablishmentQueue(
    establishmentId: number
  ): Promise<EstablishmentQueueResponse> {
    const response = await ApiClient.getClient().get<EstablishmentQueueResponse>(
      API_CONFIG.ENDPOINTS.QUEUE_BY_ESTABLISHMENT(establishmentId)
    );

    return response.data;
  }

  /**
   * Call next customer in queue (merchant only)
   */
  async callNext(establishmentId: number): Promise<CallNextResponse> {
    const response = await ApiClient.getClient().put<CallNextResponse>(
      API_CONFIG.ENDPOINTS.QUEUE_CALL_NEXT(establishmentId)
    );

    return response.data;
  }

  /**
   * Mark queue entry as finished (merchant only)
   */
  async finishQueue(queueId: number): Promise<FinishQueueResponse> {
    const response = await ApiClient.getClient().put<FinishQueueResponse>(
      API_CONFIG.ENDPOINTS.QUEUE_FINISH(queueId)
    );

    return response.data;
  }

  /**
   * Check if user has active queue at establishment
   */
  async hasActiveQueueAt(establishmentId: number): Promise<Queue | null> {
    const myQueues = await this.getMyQueues();
    const activeQueue = myQueues.activeQueues.find(
      (q) => q.establishmentId === establishmentId && q.status === 'WAITING'
    );
    return activeQueue || null;
  }
}

export default new QueueService();

