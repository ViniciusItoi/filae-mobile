/**
 * Favorite Types
 * Based on Filae API - Favorites endpoints
 */

import { Establishment } from './establishment.types';

export interface Favorite {
  id: number;
  userId: number;
  establishmentId: number;
  establishment: Establishment;
  createdAt: string;
}

export interface AddFavoriteRequest {
  establishmentId: number;
}

export interface AddFavoriteResponse {
  favorite: Favorite;
  message: string;
}

export interface RemoveFavoriteResponse {
  message: string;
}

export interface IsFavoritedResponse {
  isFavorited: boolean;
  favoriteId?: number;
}

