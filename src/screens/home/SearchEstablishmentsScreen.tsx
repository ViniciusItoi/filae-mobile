/**
 * Search Establishments Screen
 * Allow user to search, filter and browse establishments
 * Based on Figma prototype
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import { Establishment, EstablishmentCategory } from '../../types';
import { EstablishmentService, QueueService } from '../../services';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { Header, Card } from '../../components/common';

interface SearchEstablishmentsScreenProps {
  navigation: any;
  route: any;
}

const CATEGORIES: { value: EstablishmentCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'cafe', label: 'Cafeteria' },
  { value: 'clinic', label: 'Clínica' },
  { value: 'salon', label: 'Salão' },
  { value: 'barber', label: 'Barbearia' },
  { value: 'bank', label: 'Banco' },
  { value: 'cinema', label: 'Cinema' },
  { value: 'store', label: 'Loja' },
];

export const SearchEstablishmentsScreen: React.FC<SearchEstablishmentsScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const initialSearch = route?.params?.initialSearch || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<EstablishmentCategory | 'all'>('all');
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [userQueues, setUserQueues] = useState<Map<number, boolean>>(new Map());
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Load establishments on mount and when filters change
  useEffect(() => {
    loadEstablishments();
  }, [selectedCategory]); // Only reload when category changes, not on every mount

  // Trigger search when initialSearch is provided from navigation params
  useEffect(() => {
    if (initialSearch && initialSearch.trim()) {
      // Set the search query and it will be picked up by handleSearchSubmit
      setSearchQuery(initialSearch);
    }
  }, []); // Only run once on mount

  // Auto-reload user queues when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadEstablishments();
    }, [selectedCategory, searchQuery])
  );

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      const filters: any = {};

      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }

      if (searchQuery.trim()) {
        filters.name = searchQuery.trim();
      }

      const data = await EstablishmentService.getEstablishments(filters);
      setEstablishments(data || []);

      // Load user's active queues
      const queues = await QueueService.getMyQueues();
      const queueMap = new Map<number, boolean>();
      queues.activeQueues.forEach(q => {
        queueMap.set(q.establishmentId, true);
      });
      setUserQueues(queueMap);
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error);
      Alert.alert(t('common.error'), 'Erro ao carregar estabelecimentos');
    } finally {
      setLoading(false);
    }
  };

  const handleEstablishmentPress = async (establishment: Establishment) => {
    navigation.navigate('EstablishmentDetails', { establishment });
  };

  const handleJoinQueue = async (establishment: Establishment) => {
    // Check if user is already in queue
    const hasActiveQueue = userQueues.has(establishment.id);

    if (hasActiveQueue) {
      Alert.alert(
        t('establishment.alreadyInQueue'),
        t('establishment.alreadyInQueueMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('queues.viewQueue'),
            onPress: () => {
              navigation.navigate('MyQueues');
            },
          },
        ]
      );
      return;
    }

    // Navigate to CreateQueue screen
    navigation.navigate('CreateQueue', { establishmentId: establishment.id });
  };

  const handleLeaveQueue = async (establishmentId: number) => {
    try {
      const queues = await QueueService.getMyQueues();
      const queue = queues.activeQueues.find(q => q.establishmentId === establishmentId);

      if (!queue) return;

      Alert.alert(
        t('establishment.leaveQueueTitle'),
        t('establishment.leaveQueueMessage'),
        [
          { text: t('queues.cancel'), style: 'cancel' },
          {
            text: t('establishment.giveUp'),
            style: 'destructive',
            onPress: async () => {
              try {
                await QueueService.cancelQueue(queue.id);
                const newMap = new Map(userQueues);
                newMap.delete(establishmentId);
                setUserQueues(newMap);
                Alert.alert(
                  t('establishment.leaveSuccess'),
                  t('establishment.leaveSuccessMessage')
                );
              } catch (error: any) {
                Alert.alert(t('common.error'), error.message || 'Erro ao sair da fila');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao processar saída da fila:', error);
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
    // Navigate back to Home
    navigation.navigate('Home');
  };

  const handleSearchSubmit = useCallback(() => {
    // Called when user presses Enter on search input
    loadEstablishments();
  }, [searchQuery]);

  const renderEstablishmentCard = ({ item }: { item: Establishment }) => {
    const isUserInQueue = userQueues.has(item.id);

    return (
      <Card style={styles.establishmentCard}>
          {/* Header with name and distance */}
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDistance}>
                📍 {item.city || 'Localização não disponível'}
              </Text>
            </View>
          </View>

          {/* Wait time and status */}
          <View style={styles.cardStats}>
            <Text style={styles.waitTime}>
              ⏱️ {item.estimatedWaitTime} {t('home.minutes')}
            </Text>
            <Text style={styles.waitLabel}>{t('establishment.averageWaitingTime')}</Text>
          </View>

          {/* Queue status and action button */}
          <View style={styles.cardFooter}>
            {isUserInQueue ? (
              <>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{t('establishment.inQueue')}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleLeaveQueue(item.id)}
                  style={styles.giveUpButton}
                >
                  <Text style={styles.giveUpButtonText}>{t('establishment.giveUp')}</Text>
                </TouchableOpacity>
              </>
            ) : item.isAcceptingCustomers ? (
              <>
                {item.category && (
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>
                      {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => handleJoinQueue(item)}
                  style={styles.enterButton}
                >
                  <Text style={styles.enterButtonText}>{t('establishment.getIn')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.notAcceptingContainer}>
                <Text style={styles.notAcceptingText}>
                  {t('establishment.queueNotAccepting')}
                </Text>
              </View>
            )}
          </View>
        </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        searchPlaceholder={t('home.searchPlaceholder')}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onLogoPress={handleLogoPress}
        onProfileMenuGoProfile={handleProfilePress}
        onProfileMenuGoQueues={handleProfileMenuGoQueues}
        onProfileMenuGoMyQueues={handleProfileMenuGoMyQueues}
        onProfileMenuLogout={handleProfileMenuLogout}
      />

      {/* Category Filter Section */}
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <Text style={styles.categoryButtonText}>{t('establishment.category')} ▼</Text>
        </TouchableOpacity>

        {showCategoryDropdown && (
          <View style={styles.categoryDropdown}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryOption,
                  selectedCategory === cat.value && styles.categoryOptionSelected,
                ]}
                onPress={() => {
                  setSelectedCategory(cat.value);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    selectedCategory === cat.value && styles.categoryOptionTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Establishments List Wrapper */}
      <View style={styles.listWrapper}>

      {/* Establishments List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : establishments.length > 0 ? (
        <ScrollView
          style={styles.listWrapper}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.listContent}>
            <Text style={styles.resultsCount}>
              {establishments.length} {t('common.results')}
            </Text>
            {establishments.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => handleEstablishmentPress(item)}
              >
                {renderEstablishmentCard({ item })}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('common.noResults')}</Text>
          <Text style={styles.emptyText}>
            {t('common.tryChangingFilters')}
          </Text>
        </View>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 0,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterSection: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryButton: {
    backgroundColor: '#2D006E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: typography.fontWeight.semiBold,
  },
  categoryDropdown: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 300,
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryOptionSelected: {
    backgroundColor: '#F3F4F6',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'DM Sans',
  },
  categoryOptionTextSelected: {
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  listWrapper: {
    flex: 1,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#717171',
    fontFamily: 'DM Sans',
  },
  establishmentCard: {
    marginBottom: 12,
    backgroundColor: '#2D006E',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold,
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  cardDistance: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'DM Sans',
    marginTop: 4,
  },
  cardStats: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  waitTime: {
    fontSize: 18,
    fontWeight: typography.fontWeight.semiBold,
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  waitLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'DM Sans',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#FFC769',
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: 'DM Sans',
  },
  giveUpButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  giveUpButtonText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: 'DM Sans',
  },
  categoryTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  enterButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  enterButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: 'DM Sans',
  },
  notAcceptingContainer: {
    flex: 1,
  },
  notAcceptingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'DM Sans',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  },
});

