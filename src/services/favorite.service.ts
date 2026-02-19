/**
 * Favorite Service
 * Handles favorite establishments operations
 */

import ApiClient from '../api/client';
import API_CONFIG from '../config/api.config';
import {
  Favorite,
  AddFavoriteRequest,
  AddFavoriteResponse,
  RemoveFavoriteResponse,
  IsFavoritedResponse,
} from '../types';

class FavoriteService {
  /**
   * Get all user's favorites
   */
  async getFavorites(): Promise<Favorite[]> {
    const response = await ApiClient.getClient().get<Favorite[]>(
      API_CONFIG.ENDPOINTS.FAVORITES
    );

    return response.data;
  }

  /**
   * Check if establishment is favorited
   */
  async isFavorited(establishmentId: number): Promise<IsFavoritedResponse> {
    const response = await ApiClient.getClient().get<IsFavoritedResponse>(
      API_CONFIG.ENDPOINTS.FAVORITE_CHECK(establishmentId)
    );

    return response.data;
  }

  /**
   * Add establishment to favorites
   */
  async addFavorite(data: AddFavoriteRequest): Promise<AddFavoriteResponse> {
    const response = await ApiClient.getClient().post<AddFavoriteResponse>(
      API_CONFIG.ENDPOINTS.FAVORITES,
      data
    );

    return response.data;
  }

  /**
   * Remove establishment from favorites
   */
  async removeFavorite(favoriteId: number): Promise<RemoveFavoriteResponse> {
    const response = await ApiClient.getClient().delete<RemoveFavoriteResponse>(
      API_CONFIG.ENDPOINTS.FAVORITE_BY_ID(favoriteId)
    );

    return response.data;
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(establishmentId: number): Promise<boolean> {
    const { isFavorited, favoriteId } = await this.isFavorited(establishmentId);

    if (isFavorited && favoriteId) {
      await this.removeFavorite(favoriteId);
      return false;
    } else {
      await this.addFavorite({ establishmentId });
      return true;
    }
  }
}

export default new FavoriteService();

