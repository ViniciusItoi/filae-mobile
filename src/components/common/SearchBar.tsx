/**
 * SearchBar Component
 * Search input with icon
 */

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Text,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
  showClear?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onClear,
  showClear = false,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconLeft}>
        <Text style={styles.icon}>🔍</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Buscar estabelecimentos..."
        placeholderTextColor={colors.textSecondary}
        {...props}
      />

      {showClear && (
        <TouchableOpacity
          style={styles.iconRight}
          onPress={onClear}
          disabled={!onClear}>
          <Text style={styles.icon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  icon: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
    padding: 0,
  },
});

