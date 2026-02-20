/**
 * Edit Queue Screen
 * Allow user to update queue information (partySize, notes)
 */

import React, { useState } from 'react';
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
import { Queue } from '../../types';
import { Button, Card, Divider } from '../../components/common';
import { QueueService } from '../../services';

interface EditQueueScreenProps {
  navigation: any;
  route: any;
}

export const EditQueueScreen: React.FC<EditQueueScreenProps> = ({
  navigation,
  route,
}) => {
  const { queue } = route.params as { queue: Queue };
  const [partySize, setPartySize] = useState(queue.partySize.toString());
  const [notes, setNotes] = useState(queue.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const newPartySize = parseInt(partySize, 10);

    if (isNaN(newPartySize) || newPartySize < 1) {
      Alert.alert('Erro', 'Tamanho do grupo deve ser no mínimo 1');
      return;
    }

    if (newPartySize > 20) {
      Alert.alert('Erro', 'Tamanho do grupo não pode exceder 20 pessoas');
      return;
    }

    try {
      setLoading(true);
      await QueueService.updateQueue(queue.id, {
        partySize: newPartySize,
        notes: notes.trim() || undefined,
      });

      Alert.alert('Sucesso', 'Informações da fila atualizadas!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar fila');
    } finally {
      setLoading(false);
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <Card>
        <Text style={styles.label}>Estabelecimento</Text>
        <Text style={styles.establishmentName}>{queue.establishmentName}</Text>
        <Divider spacing="small" />
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoLabel}>Ticket</Text>
            <Text style={styles.infoValue}>{queue.ticketNumber}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Posição</Text>
            <Text style={styles.infoValue}>{queue.position}</Text>
          </View>
        </View>
      </Card>

      {/* Party Size */}
      <Card>
        <Text style={styles.label}>Tamanho do Grupo</Text>
        <View style={styles.partySizeContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={decrementPartySize}
            disabled={loading}>
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.partySizeInput}
            value={partySize}
            onChangeText={setPartySize}
            keyboardType="number-pad"
            maxLength={2}
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={incrementPartySize}
            disabled={loading}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>Número de pessoas que aguardam (1-20)</Text>
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
          editable={!loading}
        />
        <Text style={styles.charCount}>{notes.length}/200</Text>
      </Card>

      {/* Actions */}
      <Card>
        <Button
          title={loading ? 'Salvando...' : 'Salvar Alterações'}
          onPress={handleSave}
          loading={loading}
          disabled={loading}
        />
        <View style={styles.spacing} />
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          variant="outline"
          disabled={loading}
        />
      </Card>

      {/* Warning */}
      <Card>
        <Text style={styles.warningText}>
          ⚠️ As alterações só são permitidas enquanto sua fila está ativa.
          Sua posição na fila não será alterada.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  establishmentName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  warningText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

