/**
 * Divider Component
 * Horizontal divider line
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface DividerProps {
  style?: ViewStyle;
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export const Divider: React.FC<DividerProps> = ({
  style,
  spacing: spacingProp = 'medium',
}) => {
  const getSpacing = () => {
    switch (spacingProp) {
      case 'none':
        return 0;
      case 'small':
        return spacing.sm;
      case 'medium':
        return spacing.md;
      case 'large':
        return spacing.lg;
      default:
        return spacing.md;
    }
  };

  return (
    <View
      style={[
        styles.divider,
        {
          marginVertical: getSpacing(),
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
});

