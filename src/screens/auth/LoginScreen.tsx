/**
 * Login Screen
 * Matches prototype design exactly
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';
import { Input, Button } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

export const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      console.log('📝 LoginScreen: Chamando signIn...');
      await signIn({
        email,
        password,
      });
      console.log('✅ LoginScreen: signIn concluído com sucesso!');
    } catch (error: any) {
      console.error('❌ LoginScreen: Erro no signIn:', error);
      Alert.alert('Erro de Login', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
      console.log('🏁 LoginScreen: Loading finalizado');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Senha', 'Enviaremos um link de recuperação para seu email');
  };

  const handleSignUp = () => {
    Alert.alert('Registrar', 'Funcionalidade de registro em breve');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Purple Card Background */}
        <View style={styles.purpleCard}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/images/FILA[e] - Logo Branco Amarelo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>{t('auth.tagline')}</Text>

          {/* Google Sign-In Button */}
          <TouchableOpacity style={styles.googleButton} disabled={loading}>
            <Text style={styles.googleIcon}>🔍</Text>
            <Text style={styles.googleButtonText}>{t('auth.continueWithGoogle')}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.orLoginWith')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Input
              label={t('auth.email')}
              placeholder="yourname@gmail.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Input
              label={t('auth.password')}
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}>
                  <Text style={styles.showPasswordIcon}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              }
            />
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
              disabled={loading}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{t('auth.rememberMe')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={loading}>
              <Text style={styles.forgotPasswordLink}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            title={loading ? t('auth.loggingIn') : t('auth.login')}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          />

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>{t('auth.signupText')} </Text>
            <TouchableOpacity onPress={handleSignUp} disabled={loading}>
              <Text style={styles.signupLink}>{t('auth.signUp')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms Footer */}
        <Text style={styles.termsText}>
          {t('auth.termsStart')}{' '}
          <Text style={styles.termsLink}>{t('auth.termsOfService')}</Text> {t('auth.and')}{' '}
          <Text style={styles.termsLink}>{t('auth.dataProcessing')}</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  purpleCard: {
    backgroundColor: '#2D006E',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    overflow: 'hidden',
  },
  logoSection: {
    marginBottom: spacing.xl,
    alignItems: 'left',
    height: 140,
    justifyContent: 'left',
    overflow: 'hidden',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  tagline: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: '#FFFFFF',
    marginBottom: spacing.xl,
    textAlign: 'left',
    fontFamily: 'DM Sans',
  },
  googleButton: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  googleIcon: {
    fontSize: 20,
  },
  googleButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: '#111827',
    fontFamily: 'DM Sans',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: typography.fontSize.xs,
    color: '#D1D5DB',
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: spacing.md,
  },
  showPasswordIcon: {
    fontSize: 18,
  },
  bottomControls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  checkmark: {
    color: '#2D006E',
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'DM Sans',
  },
  checkboxLabel: {
    fontSize: typography.fontSize.xs,
    color: '#F3F4F6',
    fontFamily: 'DM Sans',
  },
  forgotPasswordLink: {
    fontSize: typography.fontSize.xs,
    color: '#FCD34D',
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: 'DM Sans',
  },
  loginButton: {
    width: '100%',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  signupText: {
    fontSize: typography.fontSize.xs,
    color: '#F3F4F6',
    fontFamily: 'DM Sans',
  },
  signupLink: {
    fontSize: typography.fontSize.xs,
    color: '#FCD34D',
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: 'DM Sans',
  },
  termsText: {
    fontSize: typography.fontSize.xs,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    fontFamily: 'DM Sans',
  },
  termsLink: {
    fontWeight: typography.fontWeight.semiBold,
    color: '#111827',
    fontFamily: 'DM Sans',
  },
});

