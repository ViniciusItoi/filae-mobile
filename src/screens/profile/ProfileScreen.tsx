/**
 * Profile Screen
 * User profile information and settings - matching Figma prototype "My Profile"
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import { User } from '../../types';
import { UserService } from '../../services';
import { Button, Avatar, Header } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [])
  );

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

  const handleProfileMenuGoMyQueues = () => {
    // For CUSTOMER - view queues they're in
    navigation.navigate('MyQueues');
  };

  const handleProfileMenuLogout = async () => {
    await signOut();
  };

  const handleLogoPress = () => {
    navigation.navigate('Home');
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
    <View style={styles.container}>
      {/* Header with search and profile menu */}
      <Header
        showSearchInput={false}
        showProfileButton={false}
        onLogoPress={handleLogoPress}
        onProfileMenuGoProfile={() => {}}
        onProfileMenuGoMyQueues={handleProfileMenuGoMyQueues}
        onProfileMenuLogout={handleProfileMenuLogout}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.pageTitle}>Meu Perfil</Text>

        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <Avatar
            name={user.name}
            imageUrl={user.profilePictureUrl}
            size="large"
            backgroundColor="rgba(98, 0, 238, 0.3)"
            textColor="#FFFFFF"
          />
        </View>

        {/* User Info Card - Purple Background */}
        <View style={styles.infoCard}>
          {/* Name */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
          </View>

          {/* Email */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          {/* Phone */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{user.phone || '-'}</Text>
          </View>
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>


        <View style={styles.spacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  avatarCard: {
    alignItems: 'center',
    marginVertical: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  infoCard: {
    backgroundColor: colors.purple,
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  infoRow: {
    marginBottom: spacing.lg,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondaryLight,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnPurple,
  },
  editButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnPurple,
  },
  spacing: {
    height: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
});

