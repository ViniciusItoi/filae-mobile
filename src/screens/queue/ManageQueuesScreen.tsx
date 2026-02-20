/**
 * Manage Queues Screen
 * For MERCHANTS to manage their establishment queues
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
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import { Queue, EstablishmentQueueResponse } from '../../types';
import { QueueService, EstablishmentService } from '../../services';
import { Header, Card, Badge, Button, EmptyState } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';

interface ManageQueuesScreenProps {
  navigation: any;
}

export const ManageQueuesScreen: React.FC<ManageQueuesScreenProps> = ({ navigation }) => {
  const { signOut, user } = useAuth();
  const [queueData, setQueueData] = useState<EstablishmentQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [establishmentId, setEstablishmentId] = useState<number | null>(null);

  useEffect(() => {
    loadMerchantEstablishment();
  }, []);

  // Auto-refresh when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      if (establishmentId) {
        loadQueues();
      }
    }, [establishmentId])
  );

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!establishmentId) return;

    const interval = setInterval(() => {
      loadQueues(true); // Silent refresh
    }, 10000);

    return () => clearInterval(interval);
  }, [establishmentId]);

  const loadMerchantEstablishment = async () => {
    try {
      setLoading(true);
      // Get merchant's establishment
      const establishments = await EstablishmentService.getEstablishments({});
      const merchantEstablishment = establishments.find(e => e.merchantId === user?.id);

      if (merchantEstablishment) {
        setEstablishmentId(merchantEstablishment.id);
        await loadQueuesForEstablishment(merchantEstablishment.id);
      } else {
        setLoading(false);
        Alert.alert('Aviso', 'Você não possui um estabelecimento cadastrado.');
      }
    } catch (error) {
      console.error('Erro ao carregar estabelecimento:', error);
      setLoading(false);
      Alert.alert('Erro', 'Erro ao carregar seu estabelecimento');
    }
  };

  const loadQueuesForEstablishment = async (estId: number, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await QueueService.getEstablishmentQueue(estId);
      setQueueData(data);
    } catch (error) {
      console.error('Erro ao carregar filas:', error);
      if (!silent) {
        Alert.alert('Erro', 'Erro ao carregar filas do estabelecimento');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadQueues = async (silent = false) => {
    if (!establishmentId) return;
    await loadQueuesForEstablishment(establishmentId, silent);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQueues();
    setRefreshing(false);
  };

  const handleCallNext = async () => {
    if (!establishmentId) return;

    const waitingQueues = queueData?.queues.filter(q => q.status === 'WAITING') || [];
    if (waitingQueues.length === 0) {
      Alert.alert('Aviso', 'Não há clientes aguardando na fila.');
      return;
    }

    try {
      setActionLoading(true);
      const response = await QueueService.callNext(establishmentId);
      Alert.alert(
        'Cliente Chamado!',
        `Ticket #${response.calledQueue.ticketNumber} foi chamado.\nCliente: ${response.calledQueue.userName}`,
        [{ text: 'OK', onPress: () => loadQueues() }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao chamar próximo cliente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinishQueue = async (queue: Queue) => {
    Alert.alert(
      'Finalizar Atendimento',
      `Deseja finalizar o atendimento do ticket #${queue.ticketNumber}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: async () => {
            try {
              setActionLoading(true);
              await QueueService.finishQueue(queue.id);
              Alert.alert('Sucesso', 'Atendimento finalizado!');
              await loadQueues();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao finalizar atendimento');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancelQueue = async (queue: Queue) => {
    Alert.alert(
      'Cancelar Fila',
      `Deseja cancelar o ticket #${queue.ticketNumber}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await QueueService.cancelQueue(queue.id);
              Alert.alert('Sucesso', 'Fila cancelada!');
              await loadQueues();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao cancelar fila');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleProfileMenuGoQueues = () => {
    // Already on ManageQueues screen, reload
    loadQueues();
  };

  const handleProfileMenuLogout = async () => {
    await signOut();
  };

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  const getStatusBadgeVariant = (status: Queue['status']) => {
    switch (status) {
      case 'WAITING':
        return 'waiting';
      case 'CALLED':
        return 'called';
      case 'FINISHED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: Queue['status']) => {
    switch (status) {
      case 'WAITING':
        return 'Aguardando';
      case 'CALLED':
        return 'Chamado';
      case 'FINISHED':
        return 'Finalizado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const renderQueueItem = ({ item }: { item: Queue }) => {
    return (
      <Card style={styles.queueCard}>
        <View style={styles.queueHeader}>
          <View style={styles.queueHeaderLeft}>
            <Text style={styles.ticketNumber}>#{item.ticketNumber}</Text>
            <Badge
              text={getStatusText(item.status)}
              variant={getStatusBadgeVariant(item.status)}
            />
          </View>
          <Text style={styles.positionText}>Posição: {item.position}</Text>
        </View>

        <View style={styles.queueInfo}>
          <Text style={styles.customerName}>👤 {item.userName}</Text>
          {item.partySize > 1 && (
            <Text style={styles.partySize}>👥 {item.partySize} pessoas</Text>
          )}
          {item.notes && (
            <Text style={styles.notes}>📝 {item.notes}</Text>
          )}
        </View>

        <View style={styles.queueTime}>
          <Text style={styles.timeText}>
            Entrou: {new Date(item.joinedAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          {item.calledAt && (
            <Text style={styles.timeText}>
              Chamado: {new Date(item.calledAt).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          )}
        </View>

        {/* Actions */}
        {item.status === 'CALLED' && (
          <View style={styles.actions}>
            <Button
              title="Finalizar"
              onPress={() => handleFinishQueue(item)}
              variant="primary"
              style={styles.actionButton}
              disabled={actionLoading}
            />
            <Button
              title="Cancelar"
              onPress={() => handleCancelQueue(item)}
              variant="outline"
              style={styles.actionButton}
              disabled={actionLoading}
            />
          </View>
        )}

        {item.status === 'WAITING' && (
          <View style={styles.actions}>
            <Button
              title="Cancelar"
              onPress={() => handleCancelQueue(item)}
              variant="outline"
              style={styles.actionButtonFull}
              disabled={actionLoading}
            />
          </View>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          showSearchInput={false}
          showProfileButton={true}
          onLogoPress={handleLogoPress}
          onProfileMenuGoProfile={handleProfilePress}
          onProfileMenuGoQueues={handleProfileMenuGoQueues}
          onProfileMenuLogout={handleProfileMenuLogout}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando filas...</Text>
        </View>
      </View>
    );
  }

  if (!establishmentId || !queueData) {
    return (
      <View style={styles.container}>
        <Header
          showSearchInput={false}
          showProfileButton={true}
          onLogoPress={handleLogoPress}
          onProfileMenuGoProfile={handleProfilePress}
          onProfileMenuGoQueues={handleProfileMenuGoQueues}
          onProfileMenuLogout={handleProfileMenuLogout}
        />
        <EmptyState
          icon="🏪"
          title="Sem Estabelecimento"
          message="Você precisa ter um estabelecimento cadastrado para gerenciar filas."
        />
      </View>
    );
  }

  const waitingQueues = queueData.queues.filter(q => q.status === 'WAITING');
  const calledQueues = queueData.queues.filter(q => q.status === 'CALLED');
  const allActiveQueues = [...calledQueues, ...waitingQueues];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        showSearchInput={false}
        showProfileButton={true}
        onLogoPress={handleLogoPress}
        onProfileMenuGoProfile={handleProfilePress}
        onProfileMenuGoQueues={handleProfileMenuGoQueues}
        onProfileMenuLogout={handleProfileMenuLogout}
      />

      {/* Page Title & Stats */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Gerenciar Filas</Text>
        <Text style={styles.establishmentName}>{queueData.establishment.name}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{queueData.totalWaiting}</Text>
          <Text style={styles.statLabel}>Aguardando</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{queueData.totalCalled}</Text>
          <Text style={styles.statLabel}>Chamados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{queueData.averageWaitTime}</Text>
          <Text style={styles.statLabel}>Tempo Médio</Text>
        </View>
      </View>

      {/* Call Next Button */}
      {waitingQueues.length > 0 && (
        <View style={styles.callNextContainer}>
          <Button
            title="🔔 Chamar Próximo"
            onPress={handleCallNext}
            variant="primary"
            disabled={actionLoading}
            style={styles.callNextButton}
          />
        </View>
      )}

      {/* Queues List */}
      {allActiveQueues.length > 0 ? (
        <FlatList
          data={allActiveQueues}
          renderItem={renderQueueItem}
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
            icon="✅"
            title="Nenhuma Fila Ativa"
            message="Não há clientes na fila no momento."
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
    paddingBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: '#1A1A1A',
    fontFamily: 'DM Sans',
  },
  establishmentName: {
    fontSize: 16,
    color: '#717171',
    fontFamily: 'DM Sans',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    fontFamily: 'DM Sans',
  },
  statLabel: {
    fontSize: 12,
    color: '#717171',
    fontFamily: 'DM Sans',
    marginTop: 4,
  },
  callNextContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  callNextButton: {
    backgroundColor: colors.primary,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyScrollContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  queueCard: {
    marginBottom: 12,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  queueHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketNumber: {
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    fontFamily: 'DM Sans',
  },
  positionText: {
    fontSize: 14,
    fontWeight: typography.fontWeight.semiBold,
    color: '#717171',
    fontFamily: 'DM Sans',
  },
  queueInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold,
    color: '#1A1A1A',
    fontFamily: 'DM Sans',
    marginBottom: 4,
  },
  partySize: {
    fontSize: 14,
    color: '#717171',
    fontFamily: 'DM Sans',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#717171',
    fontFamily: 'DM Sans',
    fontStyle: 'italic',
  },
  queueTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'DM Sans',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonFull: {
    flex: 1,
  },
});

