/**
 * Home Screen
 * Rebuilt to match the provided HTML/CSS prototype
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography } from '../../theme';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/common';
import { QueueService, FavoriteService } from '../../services';
import { Queue, Favorite } from '../../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const [activeQueue, setActiveQueue] = useState<Queue | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh data when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const queues = await QueueService.getMyQueues();
      const active = queues.activeQueues?.[0] || null;
      setActiveQueue(active);

      const favoritesData = await FavoriteService.getFavorites();
      setFavorites(favoritesData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleViewActiveQueueDetails = async () => {
    if (activeQueue) {
      // Navigate to EstablishmentDetails for the active queue's establishment
      try {
        const EstablishmentService = require('../../services/establishment.service').default;
        const establishment = await EstablishmentService.getEstablishmentById(activeQueue.establishmentId);
        navigation.navigate('EstablishmentDetails', { establishment });
      } catch (error) {
        console.error('Erro ao carregar estabelecimento:', error);
        // Fallback: create minimal establishment from queue data
        navigation.navigate('EstablishmentDetails', {
          establishment: {
            id: activeQueue.establishmentId,
            name: activeQueue.establishmentName,
            category: 'other',
            description: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            isAcceptingCustomers: true,
            queueEnabled: true,
            averageServiceTime: 0,
            maxCapacity: 0,
            currentQueueSize: 0,
            estimatedWaitTime: activeQueue.estimatedWaitTime || 0,
            merchantId: 0,
            createdAt: '',
            updatedAt: '',
          }
        });
      }
    }
  };

  const handleBrowseEstablishments = () => {
    navigation.navigate('SearchEstablishments');
  };

  const handleSearchSubmit = () => {
    // Navigate to SearchEstablishments with the search query
    navigation.navigate('SearchEstablishments', { initialSearch: searchQuery });
  };

  const handleFavoritePress = async (favorite: Favorite) => {
    // Navigate to EstablishmentDetails
    // We need to fetch the full establishment details first
    try {
      const EstablishmentService = require('../../services/establishment.service').default;
      const establishment = await EstablishmentService.getEstablishmentById(favorite.establishmentId);
      navigation.navigate('EstablishmentDetails', { establishment });
    } catch (error) {
      console.error('Erro ao carregar estabelecimento:', error);
      // Fallback: create a minimal establishment object from favorite data
      navigation.navigate('EstablishmentDetails', {
        establishment: {
          id: favorite.establishmentId,
          name: favorite.establishmentName,
          category: favorite.category,
          city: favorite.city,
          description: '',
          address: '',
          state: '',
          zipCode: '',
          phone: '',
          isAcceptingCustomers: true,
          queueEnabled: true,
          averageServiceTime: 0,
          maxCapacity: 0,
          currentQueueSize: 0,
          estimatedWaitTime: 0,
          merchantId: 0,
          createdAt: '',
          updatedAt: '',
        }
      });
    }
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleProfileMenuGoMyQueues = () => {
    // For CUSTOMER - view queues they're in
    navigation.navigate('MyQueues');
  };

  const handleProfileMenuGoQueues = () => {
    // For MERCHANT - manage their establishment queues
    navigation.navigate('MyQueues', { screen: 'ManageQueuesMain' });
  };

  const handleProfileMenuLogout = async () => {
    await signOut();
  };

  const handleLogoPress = () => {
    // Already on Home screen, no navigation needed
    // Could also use: navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }>
        {/* Shared Header (Logo + Purple Card) */}
        <Header
          searchPlaceholder={t('home.searchPlaceholderLong')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onLogoPress={handleLogoPress}
          onProfileMenuGoProfile={handleProfilePress}
          onProfileMenuGoQueues={handleProfileMenuGoQueues}
          onProfileMenuGoMyQueues={handleProfileMenuGoMyQueues}
          onProfileMenuLogout={handleProfileMenuLogout}
        />

        {/* Active Ticket */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.activeTicketTitle')}</Text>
        </View>

        {activeQueue ? (
          <TouchableOpacity
            style={styles.activeTicketCard}
            onPress={handleViewActiveQueueDetails}
            activeOpacity={0.8}>
            {/* Decorative circles */}
            <View style={styles.circleLarge} />
            <View style={styles.circleSmall} />

            <Text style={styles.activeTitle}>{activeQueue.establishmentName}</Text>
            <Text style={styles.activeDistance}>{t('home.distance', '0.8 km de distância')}</Text>

            <View style={styles.activeStatsRow}>
              <View style={styles.activeStatBox}>
                <Text style={styles.activeStatLabel}>{t('home.yourPosition')}</Text>
                <View style={styles.positionRow}>
                  <Text style={styles.positionValue}>{activeQueue.position}</Text>
                  <Text style={styles.positionSuffix}>th</Text>
                </View>
              </View>
              <View style={styles.activeStatBox}>
                <Text style={styles.activeStatLabel}>{t('home.estimatedTime')}</Text>
                <Text style={styles.activeStatValue}>~{activeQueue.estimatedWaitTime} {t('home.minutes')}</Text>
              </View>
            </View>

            <View style={styles.activeFooterRow}>
              <Text style={styles.ticketNumber}>{t('home.ticketNumber', 'Ticket')} #{activeQueue.ticketNumber}</Text>
              <Text style={styles.inQueueText}>{t('home.inQueue')}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyActiveCard}>
            <Text style={styles.emptyTitle}>Nenhuma fila ativa</Text>
            <Text style={styles.emptyText}>Você não está em nenhuma fila no momento.</Text>
            <TouchableOpacity style={styles.browseButton} onPress={handleBrowseEstablishments}>
              <Text style={styles.browseButtonText}>Buscar estabelecimentos</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Favorites */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.favoritesTitle')}</Text>
        </View>

        {favorites.length > 0 ? (
          <View style={styles.favoritesContainer}>
            {/* Favorites List */}
            <View style={styles.recentList}>
              {favorites.slice(0, 2).map((fav) => (
                <TouchableOpacity
                  key={fav.id}
                  style={styles.recentCard}
                  onPress={() => handleFavoritePress(fav)}
                  activeOpacity={0.7}
                >
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentTitle}>
                      {fav.establishmentName || fav.establishment?.name || `Estabelecimento #${fav.establishmentId}`}
                    </Text>
                    <Text style={styles.recentSubtitle}>
                      {
                        [
                          fav.category || fav.establishment?.category,
                          fav.city,
                          fav.rating ? `⭐ ${fav.rating.toFixed(1)}` : null,
                        ]
                          .filter(Boolean)
                          .join(' • ') || t('home.favorite')
                      }
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyActiveCard}>
            <Text style={styles.emptyTitle}>{t('home.noFavorites')}</Text>
            <Text style={styles.emptyText}>{t('home.noFavoritesMessage')}</Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 0,
  },
  // Header styles live in TopHeaderCard now.
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: typography.fontWeight.semiBold,
    color: '#1A1A1A',
    fontFamily: 'DM Sans',
  },
  activeTicketCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#2D006E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  circleLarge: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 64,
    right: -10,
  },
  circleSmall: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -10,
    left: 24,
  },
  activeTitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'DM Sans',
  },
  activeDistance: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'DM Sans',
    marginTop: 4,
  },
  activeStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  activeStatBox: {
    width: '48%',
  },
  activeStatLabel: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'DM Sans',
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  positionValue: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  positionSuffix: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'DM Sans',
    marginBottom: 6,
  },
  activeStatValue: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
    marginTop: 4,
  },
  activeFooterRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketNumber: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'DM Sans',
  },
  inQueueText: {
    fontSize: 14,
    color: '#FFC769',
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: 'DM Sans',
  },
  emptyActiveCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: typography.fontWeight.semiBold,
    color: '#1A1A1A',
    fontFamily: 'DM Sans',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#717171',
    fontFamily: 'DM Sans',
    textAlign: 'center',
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: '#2D006E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'DM Sans',
  },
  favoritesContainer: {
    marginTop: 8,
  },
  recentList: {
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 8,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: typography.fontWeight.medium,
    color: '#1A1A1A',
    fontFamily: 'DM Sans',
  },
  recentSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#717171',
    fontFamily: 'DM Sans',
  },
  bottomSpacing: {
    height: 24,
  },
});
