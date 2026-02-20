/**
 * Establishment Service
 * Handles establishment-related operations
 */

import ApiClient from '../api/client';
import API_CONFIG from '../config/api.config';
import {
  Establishment,
  EstablishmentFilterParams,
} from '../types';

class EstablishmentService {
  /**
   * Get all establishments with optional filters
   */
  async getEstablishments(
    filters?: EstablishmentFilterParams
  ): Promise<Establishment[]> {
    const params: any = {};

    if (filters?.category) params.category = filters.category;
    if (filters?.city) params.city = filters.city;
    if (filters?.name) params.name = filters.name;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.pageSize) params.pageSize = filters.pageSize;

    const response = await ApiClient.getClient().get<Establishment[]>(
      API_CONFIG.ENDPOINTS.ESTABLISHMENTS,
      { params }
    );

    return response.data;
  }

  /**
   * Get establishment by ID
   */
  async getEstablishmentById(establishmentId: number): Promise<Establishment> {
    const response = await ApiClient.getClient().get<Establishment>(
      API_CONFIG.ENDPOINTS.ESTABLISHMENT_BY_ID(establishmentId)
    );

    return response.data;
  }

  /**
   * Filter establishments by category
   */
  async getEstablishmentsByCategory(category: string): Promise<Establishment[]> {
    return this.getEstablishments({ category: category as any });
  }

  /**
   * Filter establishments by city
   */
  async getEstablishmentsByCity(city: string): Promise<Establishment[]> {
    return this.getEstablishments({ city });
  }

  /**
   * Search establishments
   */
  async searchEstablishments(query: string): Promise<Establishment[]> {
    return this.getEstablishments({ search: query });
  }
}

export default new EstablishmentService();

