/**
 * Establishment Details Screen
 * Show establishment details matching Figma prototype
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Establishment, Queue } from '../../types';
import { Header, Button } from '../../components/common';
import { QueueService } from '../../services';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';

interface EstablishmentDetailsScreenProps {
  navigation: any;
  route: any;
}

export const EstablishmentDetailsScreen: React.FC<EstablishmentDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { establishment } = route.params as { establishment: Establishment };
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const [userQueue, setUserQueue] = useState<Queue | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUserQueue();
  }, []);

  const loadUserQueue = async () => {
    try {
      const queues = await QueueService.getMyQueues();
      const queueForThisEstablishment = queues.activeQueues?.find(
        q => q.establishmentId === establishment.id
      );
      setUserQueue(queueForThisEstablishment || null);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async () => {
    try {
      setActionLoading(true);
      await QueueService.joinQueue({
        establishmentId: establishment.id,
        partySize: 1,
      });
      Alert.alert(t('establishment.joinSuccess'), t('establishment.joinSuccessMessage'));
      await loadUserQueue(); // Reload to show ticket
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Erro ao entrar na fila');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!userQueue) return;

    Alert.alert(
      t('establishment.leaveQueueTitle'),
      t('establishment.leaveQueueMessage'),
      [
        { text: t('queues.cancel'), style: 'cancel' },
        {
          text: t('establishment.giveUp'),
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await QueueService.cancelQueue(userQueue.id);
              Alert.alert(t('establishment.leaveSuccess'), t('establishment.leaveSuccessMessage'));
              setUserQueue(null);
            } catch (error: any) {
              Alert.alert(t('common.error'), error.message || 'Erro ao sair da fila');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleProfileMenuGoQueues = () => {
    navigation.navigate('MyQueues');
  };

  const handleProfileMenuLogout = async () => {
    await signOut();
  };


  const handleSearchSubmit = () => {
    navigation.navigate('SearchEstablishments', { initialSearch: searchQuery });
  };

  const handleLogoPress = () => {
    // Navigate back to Home
    navigation.navigate('Home');
  };

  // Determine which state to show
  const isUserInQueue = !!userQueue;
  const isAcceptingCustomers = establishment.isAcceptingCustomers;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shared Header (Logo + Purple Card + Search) */}
        <Header
          searchPlaceholder={t('home.searchPlaceholderLong')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onLogoPress={handleLogoPress}
          onProfileMenuGoProfile={handleProfilePress}
          onProfileMenuGoQueues={handleProfileMenuGoQueues}
          onProfileMenuLogout={handleProfileMenuLogout}
        />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>{t('establishment.detailsTitle')}</Text>
        </View>

        {/* Main Purple Gradient Card */}
        <View style={styles.detailsCard}>
          {/* Decorative circles */}
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />

          {/* Content */}
          <View style={styles.content}>
            {/* Name and Distance */}
            <Text style={styles.establishmentName}>{establishment.name}</Text>
            <Text style={styles.distance}>0,8 km de distância</Text>

            {/* Description */}
            {establishment.description && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue} numberOfLines={6}>
                  {establishment.description}
                </Text>
                <Text style={styles.fieldLabel}>{t('establishment.description')}</Text>
              </View>
            )}

            {/* Category */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldValue}>{establishment.category}</Text>
              <Text style={styles.fieldLabel}>{t('establishment.category')}</Text>
            </View>

            {/* Address */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldValue}>{establishment.address}</Text>
              <Text style={styles.fieldLabel}>{t('establishment.address')}</Text>
            </View>

            {/* Website/Social Media */}
            {establishment.websiteUrl && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {establishment.websiteUrl}
                </Text>
                <Text style={styles.fieldLabel}>{t('establishment.websiteSocialMedia')}</Text>
              </View>
            )}

            {/* Footer Section - 3 States */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="rgba(255,255,255,0.8)" />
              </View>
            ) : isUserInQueue ? (
              // STATE 1: User is in queue - Show ticket + "Give up" button
              <>
                <View style={styles.ticketFooter}>
                  <Text style={styles.ticketNumber}>{t('establishment.ticketNumber')} #{userQueue?.ticketNumber}</Text>
                  <Text style={styles.inQueueBadge}>{t('establishment.inQueue')}</Text>
                </View>
                <Button
                  title={actionLoading ? t('establishment.leaving') : t('establishment.giveUp')}
                  onPress={handleLeaveQueue}
                  variant="danger"
                  disabled={actionLoading}
                  style={styles.actionButton}
                />
              </>
            ) : isAcceptingCustomers ? (
              // STATE 2: User not in queue + Queue accepting - Show "Get in" button
              <Button
                title={actionLoading ? t('establishment.entering') : t('establishment.getIn')}
                onPress={handleJoinQueue}
                variant="success"
                disabled={actionLoading}
                style={styles.actionButton}
              />
            ) : (
              // STATE 3: User not in queue + Queue not accepting - Show message
              <View style={styles.notAcceptingContainer}>
                <Text style={styles.notAcceptingText}>
                  {t('establishment.queueNotAccepting')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 0,
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: 'DM Sans',
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: colors.purple,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
    minHeight: 500,
  },
  circleLarge: {
    position: 'absolute',
    top: 64,
    right: -24,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circleSmall: {
    position: 'absolute',
    bottom: 48,
    left: 24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    zIndex: 1,
  },
  establishmentName: {
    fontSize: 20,
    fontFamily: 'DM Sans',
    color: 'rgba(255,254,254,0.8)',
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    color: 'rgba(255,254,254,0.6)',
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldValue: {
    fontSize: 20,
    fontFamily: 'DM Sans',
    color: 'rgba(255,254,254,0.8)',
    marginBottom: 4,
    lineHeight: 28,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    color: 'rgba(255,254,254,0.6)',
    marginTop: 4,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  ticketNumber: {
    fontSize: 20,
    fontFamily: 'DM Sans',
    color: 'rgba(255,254,254,0.8)',
  },
  inQueueBadge: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '600',
    color: '#FFC769',
  },
  actionButton: {
    marginTop: 8,
  },
  notAcceptingContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  notAcceptingText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '600',
    color: 'rgba(255,254,254,0.9)',
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
});

