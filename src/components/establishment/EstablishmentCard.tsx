/**
 * EstablishmentCard Component
 * Card for displaying establishment in list
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { IconButton } from '../common/IconButton';
import { colors, spacing, typography } from '../../theme';
import { Establishment } from '../../types';

interface EstablishmentCardProps {
  establishment: Establishment;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  establishment,
  onPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.container}>
        {/* Logo/Image */}
        {establishment.logoUrl ? (
          <Image
            source={{ uri: establishment.logoUrl }}
            style={styles.logo}
          />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]}>
            <Text style={styles.logoText}>
              {establishment.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {establishment.name}
              </Text>
              <Text style={styles.category} numberOfLines={1}>
                {establishment.category}
              </Text>
            </View>

            {onFavoritePress && (
              <IconButton
                icon={isFavorite ? '⭐' : '☆'}
                onPress={onFavoritePress}
                size={24}
                color={isFavorite ? colors.warning : colors.textSecondary}
              />
            )}
          </View>

          {/* Address */}
          <Text style={styles.address} numberOfLines={1}>
            📍 {establishment.address}, {establishment.city}
          </Text>

          {/* Status Row */}
          <View style={styles.statusRow}>
            <Badge
              text={establishment.isAcceptingCustomers ? 'Aberto' : 'Fechado'}
              variant={establishment.isAcceptingCustomers ? 'success' : 'error'}
            />

            {establishment.isAcceptingCustomers && (
              <>
                <View style={styles.dot} />
                <Text style={styles.queueInfo}>
                  🕐 ~{establishment.estimatedWaitTime} min
                </Text>

                <View style={styles.dot} />
                <Text style={styles.queueInfo}>
                  👥 {establishment.currentQueueSize} na fila
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  logoPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnPrimary,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  address: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  queueInfo: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textSecondary,
    marginHorizontal: spacing.xs,
  },
});

