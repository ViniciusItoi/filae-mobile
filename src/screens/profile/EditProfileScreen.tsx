/**
 * Edit Profile Screen
 * User profile editing interface - matching Figma prototype
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
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import { User, UpdateProfileRequest } from '../../types';
import { UserService } from '../../services';
import { Button, Avatar, Header } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';

interface EditProfileScreenProps {
  navigation: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { user: authUser, signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUserProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [])
  );

  const handleProfileMenuLogout = async () => {
    await signOut();
  };

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  const handleProfileMenuGoMyQueues = () => {
    // For CUSTOMER - view queues they're in
    navigation.navigate('MyQueues');
  };

  const handleProfileMenuGoQueues = () => {
    // For MERCHANT - manage their establishment queues
    navigation.navigate('MyQueues', { screen: 'ManageQueuesMain' });
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getMyProfile();
      setUser(userData);

      // Populate form with current data
      setName(userData.name);
      setEmail(userData.email);
      setPhone(userData.phone || '');
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      Alert.alert('Erro', 'Erro ao carregar seu perfil');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (phone.trim() && !/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updateData: UpdateProfileRequest = {
        name: name.trim(),
        phone: phone.trim() || undefined,
      };

      await UserService.updateMyProfile(updateData);

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Erro ao atualizar seu perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Deletar Conta',
      'Esta ação é irreversível. Tem certeza que deseja deletar sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Aviso', 'Funcionalidade de deleção não disponível ainda.');
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
    <View style={styles.container}>
      {/* Header with search and profile menu */}
      <Header
        showSearchInput={false}
        showProfileButton={false}
        onLogoPress={handleLogoPress}
        onProfileMenuGoQueues={handleProfileMenuGoQueues}
        onProfileMenuGoMyQueues={handleProfileMenuGoMyQueues}
        onProfileMenuLogout={handleProfileMenuLogout}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.pageTitle}>Editar Perfil</Text>

        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <Avatar
            name={user.name}
            size="large"
            backgroundColor="rgba(98, 0, 238, 0.3)"
            textColor="#FFFFFF"
          />
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Name Section */}
          <View>
            <Text style={styles.fieldLabel}>Nome Completo</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Seu nome completo"
                placeholderTextColor="#999999"
                editable={!saving}
                style={[styles.textInput, errors.name && styles.inputError]}
              />
            </View>
            {errors.name && <Text style={styles.errorMessage}>{errors.name}</Text>}
          </View>

          {/* Email Section (Read-only) */}
          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputWrapper, styles.readOnlyInput]}>
              <Text style={styles.readOnlyText}>{email}</Text>
            </View>
            <Text style={styles.helperText}>Email não pode ser alterado</Text>
          </View>

          {/* Phone Section */}
          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.fieldLabel}>Telefone</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                editable={!saving}
                style={[styles.textInput, errors.phone && styles.inputError]}
              />
            </View>
            {errors.phone && <Text style={styles.errorMessage}>{errors.phone}</Text>}
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleDeleteAccount}
          disabled={saving}
        >
          <Text style={styles.dangerButtonText}>Deletar Conta</Text>
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
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  textInput: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.md,
    fontFamily: 'DM Sans',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorMessage: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  readOnlyInput: {
    backgroundColor: colors.disabled,
    borderColor: colors.border,
  },
  readOnlyText: {
    fontSize: 16,
    color: colors.textSecondary,
    paddingVertical: spacing.md,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnPurple,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.buttonSecondaryBorder,
  },
  dangerButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.buttonDeleteBorder,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.buttonDeleteBorder,
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

