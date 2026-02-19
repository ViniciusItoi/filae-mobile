/**
 * Profile Screen
 * User profile information and settings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { User } from '../../types';
import { UserService, AuthService } from '../../services';
import { Card, Button, Avatar, Divider } from '../../components/common';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getMyProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      Alert.alert('Erro', 'Erro ao carregar seu perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Fazer Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              await AuthService.logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Erro', 'Erro ao fazer logout');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar perfil</Text>
        <Button title="Tentar Novamente" onPress={loadUserProfile} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <Card>
        <View style={styles.profileHeader}>
          <Avatar name={user.name} size="large" />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.userType}>{user.userType}</Text>
          </View>
        </View>
      </Card>

      {/* Contact Information */}
      <Card>
        <Text style={styles.sectionTitle}>📞 Informações de Contato</Text>
        <Divider spacing="small" />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Telefone:</Text>
          <Text style={styles.infoValue}>{user.phone || '-'}</Text>
        </View>
      </Card>

      {/* Account Information */}
      <Card>
        <Text style={styles.sectionTitle}>👤 Informações da Conta</Text>
        <Divider spacing="small" />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo de Usuário:</Text>
          <Text style={styles.infoValue}>{user.userType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Membro desde:</Text>
          <Text style={styles.infoValue}>
            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </Card>

      {/* Logout Button */}
      <Card>
        <Button
          title={loggingOut ? 'Saindo...' : 'Fazer Logout'}
          onPress={handleLogout}
          variant="outline"
          loading={loggingOut}
          disabled={loggingOut}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userType: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
});

