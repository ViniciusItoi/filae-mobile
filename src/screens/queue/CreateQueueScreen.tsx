/**
 * Create Queue Screen (Placeholder)
 * This functionality is integrated in EstablishmentDetailsScreen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export const CreateQueueScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Queue - Integrated in Establishment Details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    padding: spacing.md,
  },
});

