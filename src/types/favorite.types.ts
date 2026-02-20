/**
 * Favorite Types
 * Based on Filae API - Favorites endpoints
 */

import { Establishment } from './establishment.types';

export interface Favorite {
  id: number;
  establishmentId: number;
  establishmentName?: string;
  category?: string;
  city?: string;
  rating?: number;
  addedAt?: string | null;
  // Optional nested establishment when API returns expanded object.
  establishment?: Establishment;
  userId?: number;
  createdAt?: string;
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
