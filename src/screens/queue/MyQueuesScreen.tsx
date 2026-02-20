/**
 * My Queues Screen
 * List of user's active queues and queue history
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import { Queue } from '../../types';
import { QueueService } from '../../services';
import { EmptyState, LoadingSpinner, Header } from '../../components/common';
import { QueueTicket } from '../../components/queue';
import { useAuth } from '../../contexts/AuthContext';

interface MyQueuesScreenProps {
  navigation: any;
}

export const MyQueuesScreen: React.FC<MyQueuesScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth();
  const [activeQueues, setActiveQueues] = useState<Queue[]>([]);
  const [historyQueues, setHistoryQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    loadQueues();
    // Set up polling to refresh queue positions every 10 seconds
    const interval = setInterval(loadQueues, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-reload when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadQueues();
    }, [])
  );

  const loadQueues = async () => {
    try {
      const data = await QueueService.getMyQueues();
      setActiveQueues(data.activeQueues || []);
      setHistoryQueues(data.historyQueues || []);
    } catch (error) {
      console.error('Erro ao carregar filas:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQueues();
    setRefreshing(false);
  };

  const handleQueueCancel = async (queueId: number) => {
    try {
      await QueueService.cancelQueue(queueId);
      await loadQueues();
    } catch (error) {
      console.error('Erro ao cancelar fila:', error);
    }
  };

  const handleQueueDetails = async (queue: Queue) => {
    // Navigate to EstablishmentDetails for the queue's establishment
    try {
      const EstablishmentService = require('../../services/establishment.service').default;
      const establishment = await EstablishmentService.getEstablishmentById(queue.establishmentId);
      navigation.navigate('EstablishmentDetails', { establishment });
    } catch (error) {
      console.error('Erro ao carregar estabelecimento:', error);
      // Fallback: create minimal establishment from queue data
      navigation.navigate('EstablishmentDetails', {
        establishment: {
          id: queue.establishmentId,
          name: queue.establishmentName,
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
          estimatedWaitTime: queue.estimatedWaitTime || 0,
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
    // Already on MyQueues screen, do nothing or reload
    loadQueues();
  };

  const handleProfileMenuLogout = async () => {
    await signOut();
  };

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          showSearchInput={false}
          showProfileButton={true}
          onLogoPress={handleLogoPress}
          onProfileMenuGoProfile={handleProfilePress}
          onProfileMenuGoMyQueues={handleProfileMenuGoMyQueues}
          onProfileMenuLogout={handleProfileMenuLogout}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando suas filas...</Text>
        </View>
      </View>
    );
  }

  const currentData = activeTab === 'active' ? activeQueues : historyQueues;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        showSearchInput={false}
        showProfileButton={true}
        onLogoPress={handleLogoPress}
        onProfileMenuGoProfile={handleProfilePress}
        onProfileMenuGoMyQueues={handleProfileMenuGoMyQueues}
        onProfileMenuLogout={handleProfileMenuLogout}
      />

      {/* Page Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Minhas Filas</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'active' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('active')}>
          <Text style={[
            styles.tabText,
            activeTab === 'active' && styles.tabTextActive,
          ]}>
            Ativas ({activeQueues.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'history' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('history')}>
          <Text style={[
            styles.tabText,
            activeTab === 'history' && styles.tabTextActive,
          ]}>
            Histórico ({historyQueues.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Queues List */}
      {currentData.length > 0 ? (
        <FlatList
          data={currentData}
          renderItem={({ item }) => (
            <QueueTicket
              queue={item}
              onCancel={
                activeTab === 'active'
                  ? () => handleQueueCancel(item.id)
                  : undefined
              }
              onViewDetails={() => handleQueueDetails(item)}
              compact={true}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyScrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <EmptyState
            icon={activeTab === 'active' ? '📭' : '✅'}
            title={
              activeTab === 'active'
                ? 'Nenhuma fila ativa'
                : 'Sem histórico de filas'
            }
            message={
              activeTab === 'active'
                ? 'Você não está em nenhuma fila no momento. Busque um estabelecimento e entre na fila!'
                : 'Você ainda não entrou em nenhuma fila.'
            }
            actionLabel={activeTab === 'active' ? 'Buscar Estabelecimentos' : undefined}
            onAction={
              activeTab === 'active'
                ? () => navigation.navigate('SearchEstablishments')
                : undefined
            }
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'DM Sans',
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: '#1A1A1A',
    fontFamily: 'DM Sans',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginHorizontal: 24,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
    backgroundColor: 'rgba(98, 0, 238, 0.05)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: '#717171',
    fontFamily: 'DM Sans',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyScrollContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

