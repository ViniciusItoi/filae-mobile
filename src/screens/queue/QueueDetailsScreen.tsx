/**
 * Queue Details Screen
 * Show detailed queue information and status
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Queue } from '../../types';
import { Button, Card, Badge, Divider } from '../../components/common';
import { QueueService } from '../../services';

interface QueueDetailsScreenProps {
  navigation: any;
  route: any;
}

export const QueueDetailsScreen: React.FC<QueueDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { queue: initialQueue } = route.params as { queue: Queue };
  const [queue, setQueue] = useState(initialQueue);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Auto-refresh queue details every 5 seconds
    let interval: NodeJS.Timeout;
    if (autoRefresh && queue.status === 'WAITING') {
      const refreshQueue = async () => {
        try {
          const updated = await QueueService.getQueueDetails(queue.id);
          setQueue(updated);
        } catch (error) {
          console.error('Erro ao atualizar fila:', error);
        }
      };
      interval = setInterval(refreshQueue, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, queue.id, queue.status]);

  const handleCancel = async () => {
    Alert.alert(
      'Cancelar Fila',
      'Tem certeza que deseja cancelar sua posição na fila?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await QueueService.cancelQueue(queue.id);
              Alert.alert('Sucesso', 'Sua posição na fila foi cancelada');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao cancelar fila');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusBadgeVariant = () => {
    switch (queue.status) {
      case 'WAITING':
        return 'waiting';
      case 'CALLED':
        return 'called';
      case 'FINISHED':
        return 'finished';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return 'info';
    }
  };

  const getStatusText = () => {
    switch (queue.status) {
      case 'WAITING':
        return 'Aguardando';
      case 'CALLED':
        return 'Sua vez!';
      case 'FINISHED':
        return 'Finalizado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return queue.status;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Establishment Name */}
      <Card>
        <View style={styles.headerRow}>
          <Text style={styles.establishmentName}>{queue.establishmentName}</Text>
          <Badge
            text={getStatusText()}
            variant={getStatusBadgeVariant()}
          />
        </View>
      </Card>

      {/* Ticket Number */}
      <Card>
        <Text style={styles.label}>Seu Ticket</Text>
        <View style={styles.ticketBox}>
          <Text style={styles.ticketNumber}>{queue.ticketNumber}</Text>
        </View>
      </Card>

      {/* Status Information */}
      {queue.status === 'WAITING' && (
        <>
          <Card>
            <Text style={styles.label}>Posição na Fila</Text>
            <Text style={styles.largeValue}>{queue.position}</Text>
          </Card>

          <Card>
            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Tempo Estimado</Text>
                <Text style={styles.infoValue}>~{queue.estimatedWaitTime} min</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Pessoas na Fila</Text>
                <Text style={styles.infoValue}>{queue.position - 1}</Text>
              </View>
            </View>
          </Card>
        </>
      )}

      {queue.status === 'CALLED' && (
        <Card>
          <View style={styles.calledContainer}>
            <Text style={styles.calledEmoji}>🔔</Text>
            <Text style={styles.calledText}>
              Sua vez chegou! Dirija-se ao estabelecimento agora.
            </Text>
          </View>
        </Card>
      )}

      {queue.status === 'FINISHED' && (
        <Card>
          <Text style={styles.label}>Fila Finalizada</Text>
          <Divider spacing="small" />
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Entrada:</Text>
            <Text style={styles.dateValue}>
              {new Date(queue.joinedAt).toLocaleString('pt-BR')}
            </Text>
          </View>
          {queue.callTime && (
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Chamado:</Text>
              <Text style={styles.dateValue}>
                {new Date(queue.callTime).toLocaleString('pt-BR')}
              </Text>
            </View>
          )}
          {queue.finishTime && (
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Finalizado:</Text>
              <Text style={styles.dateValue}>
                {new Date(queue.finishTime).toLocaleString('pt-BR')}
              </Text>
            </View>
          )}
        </Card>
      )}

      {/* Party Size */}
      <Card>
        <Text style={styles.label}>Tamanho do Grupo</Text>
        <Text style={styles.largeValue}>{queue.partySize} {queue.partySize === 1 ? 'pessoa' : 'pessoas'}</Text>
      </Card>

      {/* Actions */}
      {queue.status === 'WAITING' && (
        <Card>
          <Button
            title={loading ? 'Cancelando...' : 'Cancelar Fila'}
            onPress={handleCancel}
            variant="outline"
            loading={loading}
            disabled={loading}
          />
          <Text style={styles.autoRefreshInfo}>
            {autoRefresh ? '🔄 Atualizando posição a cada 5s' : 'Auto-atualização desativada'}
          </Text>
        </Card>
      )}

      {queue.status === 'CALLED' && (
        <Card>
          <Button
            title="Finalizar"
            onPress={() => {
              Alert.alert(
                'Finalizar Fila',
                'Marcar sua visita como finalizada?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Finalizar',
                    onPress: async () => {
                      try {
                        await QueueService.finishQueue(queue.id);
                        navigation.goBack();
                      } catch (error) {
                        Alert.alert('Erro', 'Erro ao finalizar fila');
                      }
                    },
                  },
                ]
              );
            }}
          />
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  establishmentName: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  ticketBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  ticketNumber: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnPrimary,
  },
  largeValue: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  calledContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  calledEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  calledText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.success,
    textAlign: 'center',
    lineHeight: 24,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  dateLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  dateValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  autoRefreshInfo: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

