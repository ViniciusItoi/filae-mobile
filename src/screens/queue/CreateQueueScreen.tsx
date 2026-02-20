/**
 * Create Queue Screen
 * Allow user to join a queue at an establishment
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Establishment } from '../../types';
import { Button, Card, Divider, Badge, LoadingSpinner } from '../../components/common';
import { QueueService, EstablishmentService } from '../../services';

interface CreateQueueScreenProps {
  navigation: any;
  route: any;
}

export const CreateQueueScreen: React.FC<CreateQueueScreenProps> = ({
  navigation,
  route,
}) => {
  const { establishmentId } = route.params as { establishmentId: number };
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [partySize, setPartySize] = useState('1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadEstablishment();
  }, [establishmentId]);

  const loadEstablishment = async () => {
    try {
      const data = await EstablishmentService.getEstablishmentById(establishmentId);
      setEstablishment(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar estabelecimento', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async () => {
    const size = parseInt(partySize, 10);

    if (isNaN(size) || size < 1) {
      Alert.alert('Erro', 'Tamanho do grupo deve ser no mínimo 1');
      return;
    }

    if (size > 20) {
      Alert.alert('Erro', 'Tamanho do grupo não pode exceder 20 pessoas');
      return;
    }

    if (!establishment) return;

    try {
      setJoining(true);

      // Check if already in queue
      const existing = await QueueService.hasActiveQueueAt(establishmentId);
      if (existing) {
        Alert.alert(
          'Já na Fila',
          `Você já está na fila deste estabelecimento.\nTicket: ${existing.ticketNumber}`,
          [
            { text: 'OK' },
            {
              text: 'Ver Fila',
              onPress: () => {
                navigation.replace('MyQueues');
              },
            },
          ]
        );
        return;
      }

      // Join queue
      const response = await QueueService.joinQueue({
        establishmentId,
        partySize: size,
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        'Sucesso! 🎉',
        `Você entrou na fila!\n\nTicket: ${response.queue.ticketNumber}\nPosição: ${response.queue.position}\nTempo estimado: ~${response.queue.estimatedWaitTime} min`,
        [
          {
            text: 'Ver Minhas Filas',
            onPress: () => {
              navigation.navigate('MyQueues');
            },
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao entrar na fila');
    } finally {
      setJoining(false);
    }
  };

  const incrementPartySize = () => {
    const current = parseInt(partySize, 10);
    if (!isNaN(current) && current < 20) {
      setPartySize((current + 1).toString());
    }
  };

  const decrementPartySize = () => {
    const current = parseInt(partySize, 10);
    if (!isNaN(current) && current > 1) {
      setPartySize((current - 1).toString());
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  if (!establishment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Estabelecimento não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Establishment Info */}
      <Card>
        <Text style={styles.establishmentName}>{establishment.name}</Text>
        <Text style={styles.category}>{establishment.category}</Text>
        <Divider spacing="small" />
        <View style={styles.statusRow}>
          <Badge
            text={establishment.isAcceptingCustomers ? 'Aceitando Clientes' : 'Fechado'}
            variant={establishment.isAcceptingCustomers ? 'success' : 'error'}
          />
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Fila Atual</Text>
            <Text style={styles.infoValue}>{establishment.currentQueueSize}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Tempo Estimado</Text>
            <Text style={styles.infoValue}>~{establishment.estimatedWaitTime} min</Text>
          </View>
        </View>
      </Card>

      {establishment.isAcceptingCustomers ? (
        <>
          {/* Party Size */}
          <Card>
            <Text style={styles.label}>Tamanho do Grupo *</Text>
            <View style={styles.partySizeContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={decrementPartySize}
                disabled={joining}>
                <Text style={styles.buttonText}>−</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.partySizeInput}
                value={partySize}
                onChangeText={setPartySize}
                keyboardType="number-pad"
                maxLength={2}
                editable={!joining}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={incrementPartySize}
                disabled={joining}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Quantas pessoas estão aguardando? (1-20)</Text>
          </Card>

          {/* Notes */}
          <Card>
            <Text style={styles.label}>Observações (Opcional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: Preferência por mesa perto da janela"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={200}
              editable={!joining}
            />
            <Text style={styles.charCount}>{notes.length}/200</Text>
          </Card>

          {/* Join Button */}
          <Card>
            <Button
              title={joining ? 'Entrando na Fila...' : 'Entrar na Fila'}
              onPress={handleJoinQueue}
              loading={joining}
              disabled={joining}
            />
            <View style={styles.spacing} />
            <Button
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="outline"
              disabled={joining}
            />
          </Card>
        </>
      ) : (
        <Card>
          <Text style={styles.closedText}>
            Este estabelecimento não está aceitando novos clientes no momento.
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
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  establishmentName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  statusRow: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  partySizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.fontSize.xxl,
    color: colors.textOnPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  partySizeInput: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    minWidth: 80,
    marginHorizontal: spacing.lg,
  },
  hint: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  spacing: {
    height: spacing.md,
  },
  closedText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    textAlign: 'center',
    lineHeight: 22,
  },
});

