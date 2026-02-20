/**
 * Filae App
 * Virtual Queue Management System
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';

function AppContent() {
  const { loading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    console.log('🎯 AppContent: loading =', loading, ', isAuthenticated =', isAuthenticated);
  }, [loading, isAuthenticated]);

  if (loading) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={true}
      />
      <RootNavigator isAuthenticated={isAuthenticated} />
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
