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
} from 'react-native';
import { colors, spacing } from '../../theme';
import { Queue } from '../../types';
import { QueueService } from '../../services';
import { EmptyState, LoadingSpinner } from '../../components/common';
import { QueueTicket } from '../../components/queue';

interface MyQueuesScreenProps {
  navigation: any;
}

export const MyQueuesScreen: React.FC<MyQueuesScreenProps> = ({ navigation }) => {
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

  const handleQueueDetails = (queue: Queue) => {
    navigation.navigate('QueueDetails', { queue });
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} message="Carregando suas filas..." />;
  }

  const currentData = activeTab === 'active' ? activeQueues : historyQueues;

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <View
          style={[
            styles.tab,
            activeTab === 'active' && styles.tabActive,
          ]}>
          {/* Active Tab */}
        </View>
        <View
          style={[
            styles.tab,
            activeTab === 'history' && styles.tabActive,
          ]}>
          {/* History Tab */}
        </View>
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
              ? () => navigation.navigate('Home')
              : undefined
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  listContent: {
    padding: spacing.md,
  },
});

