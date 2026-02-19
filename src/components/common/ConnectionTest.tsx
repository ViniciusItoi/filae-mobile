/**
 * Connection Test Component
 * Test backend connectivity and display connection info
 *
 * Usage: Add <ConnectionTest /> to your screen in DEV mode
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from './Button';
import { UserService } from '../../services';
import API_CONFIG from '../../config/api.config';
import { colors, spacing, typography } from '../../theme';

export const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [responseTime, setResponseTime] = useState<number>(0);

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testando conexão...');

    const startTime = Date.now();

    try {
      const health = await UserService.healthCheck();
      const endTime = Date.now();

      setResponseTime(endTime - startTime);
      setStatus('success');

      console.log('🔍 Health response:', health);

      // Handle both string and object responses
      if (typeof health === 'string') {
        setMessage(`✅ Conectado!\n\n${health}`);
      } else if (typeof health === 'object') {
        const status = health.status || 'UP';
        const service = health.service || 'Filae API';
        const version = health.version || '1.0.0';
        setMessage(`✅ Conectado!\n\nStatus: ${status}\nServiço: ${service}\nVersão: ${version}`);
      } else {
        setMessage(`✅ Conectado!\n\nResposta: ${JSON.stringify(health)}`);
      }
    } catch (error: any) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setStatus('error');

      console.error('❌ Health check error:', error);

      if (error.status === 0) {
        setMessage(`❌ Erro de Rede\n\nBackend não está acessível.\n\nVerifique:\n1. Backend está rodando?\n2. URL correta? ${API_CONFIG.BASE_URL}\n3. Firewall bloqueando?`);
      } else {
        setMessage(`❌ Erro ${error.status}\n\n${error.message}`);
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'testing':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  if (!__DEV__) {
    return null; // Only show in development
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔌 Teste de Conexão Backend</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Base URL:</Text>
        <Text style={styles.infoValue}>{API_CONFIG.BASE_URL}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Endpoint de Teste:</Text>
        <Text style={styles.infoValue}>{API_CONFIG.ENDPOINTS.HEALTH}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>URL Completa:</Text>
        <Text style={styles.infoValue} numberOfLines={2}>
          {API_CONFIG.BASE_URL}{API_CONFIG.ENDPOINTS.HEALTH}
        </Text>
      </View>

      <Button
        title={status === 'testing' ? 'Testando...' : 'Testar Conexão'}
        onPress={testConnection}
        loading={status === 'testing'}
        style={styles.button}
      />

      {status !== 'idle' && (
        <View style={[styles.resultBox, { borderColor: getStatusColor() }]}>
          <ScrollView style={styles.resultScroll}>
            <Text style={[styles.resultText, { color: getStatusColor() }]}>
              {message}
            </Text>

            {responseTime > 0 && (
              <Text style={styles.responseTime}>
                Tempo de resposta: {responseTime}ms
              </Text>
            )}
          </ScrollView>
        </View>
      )}

      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>💡 Dicas:</Text>
        <Text style={styles.tipText}>
          • Android Emulator usa 10.0.2.2 para localhost{'\n'}
          • iOS Simulator usa localhost diretamente{'\n'}
          • Dispositivo físico precisa do IP da máquina{'\n'}
          • Configure em src/config/env.config.ts
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  infoBox: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.disabled,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  button: {
    marginVertical: spacing.lg,
  },
  resultBox: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    maxHeight: 200,
    marginBottom: spacing.lg,
  },
  resultScroll: {
    maxHeight: 180,
  },
  resultText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  responseTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  tipsBox: {
    padding: spacing.md,
    backgroundColor: colors.info + '20',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  tipsTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

