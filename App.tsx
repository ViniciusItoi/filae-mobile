/**
 * Filae App
 * Virtual Queue Management System
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { ConnectionTest } from './src/components/common/ConnectionTest';
import { colors } from './src/theme';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    // Loading screen
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    // Show login screen if not authenticated
    return <LoginScreen />;
  }

  // Temporary home screen (will be replaced with actual screens later)
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.centerContainer}>
        <Text style={styles.welcomeText}>
          Bem-vindo, {user?.name}!
        </Text>
        <Text style={styles.subtitleText}>
          Telas principais em desenvolvimento...
        </Text>
      </View>

      {/* Connection Test - DEV MODE ONLY */}
      {__DEV__ && <ConnectionTest />}
    </ScrollView>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default App;
