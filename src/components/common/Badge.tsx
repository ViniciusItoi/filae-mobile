/**
 * Badge Component
 * Status badges for queues, notifications, etc.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'waiting'
  | 'called'
  | 'finished'
  | 'cancelled';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'info',
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: colors.success, color: colors.textOnPrimary };
      case 'warning':
        return { backgroundColor: colors.warning, color: colors.textOnPrimary };
      case 'error':
        return { backgroundColor: colors.error, color: colors.textOnPrimary };
      case 'info':
        return { backgroundColor: colors.info, color: colors.textOnPrimary };
      case 'waiting':
        return { backgroundColor: colors.queueWaiting, color: colors.text };
      case 'called':
        return { backgroundColor: colors.queueCalled, color: colors.textOnPrimary };
      case 'finished':
        return { backgroundColor: colors.queueFinished, color: colors.textOnPrimary };
      case 'cancelled':
        return { backgroundColor: colors.queueCancelled, color: colors.textOnPrimary };
      default:
        return { backgroundColor: colors.primary, color: colors.textOnPrimary };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: variantStyles.backgroundColor },
        style,
      ]}>
      <Text
        style={[
          styles.text,
          { color: variantStyles.color },
          textStyle,
        ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
});

