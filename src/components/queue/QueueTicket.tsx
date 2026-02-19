/**
 * QueueTicket Component
 * Display user's queue ticket with position
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Queue, QueueStatus } from '../../types';

interface QueueTicketProps {
  queue: Queue;
  onCancel?: () => void;
  onViewDetails?: () => void;
  compact?: boolean;
}

export const QueueTicket: React.FC<QueueTicketProps> = ({
  queue,
  onCancel,
  onViewDetails,
  compact = false,
}) => {
  const getStatusBadgeVariant = (status: QueueStatus) => {
    switch (status) {
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

  const getStatusText = (status: QueueStatus) => {
    switch (status) {
      case 'WAITING':
        return 'Aguardando';
      case 'CALLED':
        return 'Sua vez!';
      case 'FINISHED':
        return 'Finalizado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (compact) {
    return (
      <Card onPress={onViewDetails} style={styles.compactCard}>
        <View style={styles.compactContent}>
          <View style={styles.compactLeft}>
            <Text style={styles.ticketNumber}>#{queue.ticketNumber}</Text>
            <Text style={styles.compactEstablishment} numberOfLines={1}>
              {queue.establishmentName}
            </Text>
          </View>

          <View style={styles.compactRight}>
            <Badge
              text={getStatusText(queue.status)}
              variant={getStatusBadgeVariant(queue.status)}
            />
            {queue.status === 'WAITING' && (
              <Text style={styles.compactPosition}>
                Posição: {queue.position}
              </Text>
            )}
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card onPress={onViewDetails}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.establishmentName}>{queue.establishmentName}</Text>
        <Badge
          text={getStatusText(queue.status)}
          variant={getStatusBadgeVariant(queue.status)}
        />
      </View>

      {/* Ticket Number */}
      <View style={styles.ticketContainer}>
        <Text style={styles.ticketLabel}>Seu Ticket</Text>
        <View style={styles.ticketNumberBox}>
          <Text style={styles.ticketNumberLarge}>#{queue.ticketNumber}</Text>
        </View>
      </View>

      {/* Position Info */}
      {queue.status === 'WAITING' && (
        <View style={styles.positionContainer}>
          <View style={styles.positionBox}>
            <Text style={styles.positionLabel}>Posição na Fila</Text>
            <Text style={styles.positionNumber}>{queue.position}</Text>
          </View>

          <View style={styles.positionBox}>
            <Text style={styles.positionLabel}>Tempo Estimado</Text>
            <Text style={styles.positionNumber}>~{queue.estimatedWaitTime} min</Text>
          </View>
        </View>
      )}

      {/* Party Size */}
      {queue.partySize > 1 && (
        <Text style={styles.partySize}>
          👥 {queue.partySize} pessoas
        </Text>
      )}

      {/* Actions */}
      {queue.status === 'WAITING' && onCancel && (
        <Button
          title="Cancelar Fila"
          onPress={onCancel}
          variant="outline"
          style={styles.cancelButton}
        />
      )}

      {queue.status === 'CALLED' && (
        <View style={styles.calledAlert}>
          <Text style={styles.calledText}>
            🔔 Sua vez chegou! Dirija-se ao estabelecimento.
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  establishmentName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  ticketContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  ticketLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  ticketNumberBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  ticketNumberLarge: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnPrimary,
  },
  positionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  positionBox: {
    alignItems: 'center',
  },
  positionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  positionNumber: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  partySize: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
  calledAlert: {
    backgroundColor: colors.queueCalled,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  calledText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  // Compact styles
  compactCard: {
    padding: spacing.sm,
  },
  compactContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  ticketNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  compactEstablishment: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  compactRight: {
    alignItems: 'flex-end',
  },
  compactPosition: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

