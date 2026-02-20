/**
 * Queue Service
 * Handles queue management operations
 */

import ApiClient from '../api/client';
import API_CONFIG from '../config/api.config';
import {
  Queue,
  QueueStatus,
  JoinQueueRequest,
  UpdateQueueRequest,
  JoinQueueResponse,
  QueuePositionResponse,
  MyQueuesResponse,
  EstablishmentQueueResponse,
  CallNextResponse,
  CancelQueueResponse,
  FinishQueueResponse,
  MerchantQueuesResponse,
  MerchantStatsResponse,
} from '../types';

class QueueService {
  /**
   * Get my active and history queues
   */
  async getMyQueues(): Promise<MyQueuesResponse> {
    const response = await ApiClient.getClient().get<MyQueuesResponse | Queue[]>(
      API_CONFIG.ENDPOINTS.QUEUES_MY
    );

    const data = response.data as any;

    // Backend may return a plain array. Normalize to MyQueuesResponse.
    if (Array.isArray(data)) {
      const activeStatuses: QueueStatus[] = ['WAITING', 'CALLED'];
      const activeQueues = data.filter((q) => activeStatuses.includes(q.status));
      const historyQueues = data.filter((q) => !activeStatuses.includes(q.status));
      return { activeQueues, historyQueues };
    }

    // If already in expected shape, return directly
    if (data && Array.isArray(data.activeQueues) && Array.isArray(data.historyQueues)) {
      return data as MyQueuesResponse;
    }

    // Fallback empty structure
    return { activeQueues: [], historyQueues: [] };
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
   * Alias for getQueueById for convenience
   */
  async getQueueDetails(queueId: number): Promise<Queue> {
    return this.getQueueById(queueId);
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
   * Update queue entry (partySize, notes)
   */
  async updateQueue(queueId: number, data: UpdateQueueRequest): Promise<Queue> {
    const response = await ApiClient.getClient().put<Queue>(
      API_CONFIG.ENDPOINTS.QUEUE_UPDATE(queueId),
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

  /**
   * Get all queues for merchant (ordered by date)
   */
  async getMerchantAllQueues(): Promise<MerchantQueuesResponse> {
    const response = await ApiClient.getClient().get<Queue[]>(
      API_CONFIG.ENDPOINTS.QUEUES_MERCHANT_ALL
    );

    return {
      queues: response.data,
      totalQueues: response.data.length,
    };
  }

  /**
   * Get active queues for merchant (WAITING + CALLED)
   */
  async getMerchantActiveQueues(): Promise<MerchantQueuesResponse> {
    const response = await ApiClient.getClient().get<Queue[]>(
      API_CONFIG.ENDPOINTS.QUEUES_MERCHANT_ACTIVE
    );

    return {
      queues: response.data,
      totalQueues: response.data.length,
    };
  }

  /**
   * Get queues for specific establishment (merchant only)
   */
  async getMerchantEstablishmentQueues(
    establishmentId: number
  ): Promise<MerchantQueuesResponse> {
    const response = await ApiClient.getClient().get<Queue[]>(
      API_CONFIG.ENDPOINTS.QUEUES_MERCHANT_BY_ESTABLISHMENT(establishmentId)
    );

    return {
      queues: response.data,
      totalQueues: response.data.length,
    };
  }

  /**
   * Get queue statistics for merchant
   */
  async getMerchantStats(): Promise<MerchantStatsResponse> {
    const response = await ApiClient.getClient().get<MerchantStatsResponse>(
      API_CONFIG.ENDPOINTS.QUEUES_MERCHANT_STATS
    );

    return response.data;
  }
}

export default new QueueService();
