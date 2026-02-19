/**
 * Establishment Details Screen
 * Show establishment details and option to join queue
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Establishment, Queue } from '../../types';
import { Button, Card, Badge, Divider } from '../../components/common';
import { QueueService } from '../../services';

interface EstablishmentDetailsScreenProps {
  navigation: any;
  route: any;
}

export const EstablishmentDetailsScreen: React.FC<EstablishmentDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { establishment } = route.params as { establishment: Establishment };
  const [joiningQueue, setJoiningQueue] = useState(false);
  const [partySize, setPartySize] = useState(1);

  const handleJoinQueue = async () => {
    try {
      setJoiningQueue(true);
      await QueueService.joinQueue({
        establishmentId: establishment.id,
        partySize: partySize,
      });

      Alert.alert(
        'Sucesso!',
        'Você entrou na fila com sucesso. Veja suas filas em "Minhas Filas".',
        [
          {
            text: 'Ver Filas',
            onPress: () => navigation.navigate('MyQueues'),
          },
          {
            text: 'Fechar',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao entrar na fila');
    } finally {
      setJoiningQueue(false);
    }
  };

  const getQueueStatusColor = () => {
    return establishment.isAcceptingCustomers ? colors.success : colors.error;
  };

  const getQueueStatusLabel = () => {
    return establishment.isAcceptingCustomers ? 'Aceita Clientes' : 'Fechado';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoPlaceholder}>
            {establishment.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{establishment.name}</Text>
        <Text style={styles.category}>{establishment.category}</Text>
      </View>

      <Divider spacing="large" />

      {/* Status Card */}
      <Card>
        <View style={styles.statusRow}>
          <Badge
            text={getQueueStatusLabel()}
            variant={establishment.isAcceptingCustomers ? 'success' : 'error'}
          />
          <View style={styles.queueStats}>
            <Text style={styles.statLabel}>Fila Atual</Text>
            <Text style={styles.statValue}>{establishment.currentQueueSize} pessoas</Text>
          </View>
          <View style={styles.queueStats}>
            <Text style={styles.statLabel}>Tempo Estimado</Text>
            <Text style={styles.statValue}>~{establishment.estimatedWaitTime} min</Text>
          </View>
        </View>
      </Card>

      {/* Location Card */}
      <Card>
        <Text style={styles.sectionTitle}>📍 Localização</Text>
        <Divider spacing="small" />
        <Text style={styles.details}>
          {establishment.address}
        </Text>
        <Text style={styles.details}>
          {establishment.city}
        </Text>
      </Card>

      {/* Contact Card */}
      <Card>
        <Text style={styles.sectionTitle}>📞 Contato</Text>
        <Divider spacing="small" />
        <Text style={styles.details}>{establishment.phone}</Text>
      </Card>

      {/* Hours Card */}
      <Card>
        <Text style={styles.sectionTitle}>🕐 Horário</Text>
        <Divider spacing="small" />
        <View style={styles.hoursContainer}>
          <View style={styles.hourRow}>
            <Text style={styles.hourLabel}>Abre:</Text>
            <Text style={styles.hourValue}>{establishment.openingHours}</Text>
          </View>
          <View style={styles.hourRow}>
            <Text style={styles.hourLabel}>Fecha:</Text>
            <Text style={styles.hourValue}>{establishment.closingHours}</Text>
          </View>
        </View>
      </Card>

      {/* Description */}
      {establishment.description && (
        <Card>
          <Text style={styles.sectionTitle}>ℹ️ Sobre</Text>
          <Divider spacing="small" />
          <Text style={styles.details}>{establishment.description}</Text>
        </Card>
      )}

      {/* Join Queue Section */}
      {establishment.isAcceptingCustomers && (
        <Card>
          <Text style={styles.sectionTitle}>👥 Entrar na Fila</Text>
          <Divider spacing="small" />

          <Text style={styles.label}>Quantas pessoas?</Text>
          <View style={styles.partySizeContainer}>
            <Button
              title="-"
              onPress={() => setPartySize(Math.max(1, partySize - 1))}
              variant="outline"
              style={styles.partySizeButton}
            />
            <Text style={styles.partySizeValue}>{partySize}</Text>
            <Button
              title="+"
              onPress={() => setPartySize(partySize + 1)}
              variant="outline"
              style={styles.partySizeButton}
            />
          </View>

          <Button
            title={joiningQueue ? 'Entrando na fila...' : 'Entrar na Fila'}
            onPress={handleJoinQueue}
            loading={joiningQueue}
            disabled={joiningQueue || !establishment.isAcceptingCustomers}
            style={styles.joinButton}
          />
        </Card>
      )}

      {!establishment.isAcceptingCustomers && (
        <Card>
          <Text style={[styles.details, { color: colors.error, textAlign: 'center' }]}>
            Este estabelecimento não está aceitando clientes no momento
          </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoPlaceholder: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnPrimary,
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  queueStats: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  details: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  hoursContainer: {
    gap: spacing.sm,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hourLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  hourValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
  },
  partySizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  partySizeButton: {
    width: 50,
    height: 50,
  },
  partySizeValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  joinButton: {
    marginTop: spacing.md,
  },
});

