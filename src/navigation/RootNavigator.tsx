/**
 * Navigation Structure
 * Bottom Tab Navigation with Stack navigators
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { colors, typography } from '../theme';

// Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { EstablishmentDetailsScreen } from '../screens/establishment/EstablishmentDetailsScreen';
import { CreateQueueScreen } from '../screens/queue/CreateQueueScreen';
import { MyQueuesScreen } from '../screens/queue/MyQueuesScreen';
import { QueueDetailsScreen } from '../screens/queue/QueueDetailsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Home Stack Navigator
 */
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textOnPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: typography.fontSize.lg,
        },
      }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          title: 'Filae - Estabelecimentos',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EstablishmentDetails"
        component={EstablishmentDetailsScreen}
        options={{
          title: 'Detalhes do Estabelecimento',
        }}
      />
      <Stack.Screen
        name="CreateQueue"
        component={CreateQueueScreen}
        options={{
          title: 'Entrar na Fila',
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Queues Stack Navigator
 */
const QueuesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textOnPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: typography.fontSize.lg,
        },
      }}>
      <Stack.Screen
        name="MyQueuesMain"
        component={MyQueuesScreen}
        options={{
          title: 'Minhas Filas',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="QueueDetails"
        component={QueueDetailsScreen}
        options={{
          title: 'Detalhes da Fila',
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Profile Stack Navigator
 */
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textOnPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: typography.fontSize.lg,
        },
      }}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          title: 'Meu Perfil',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Main Navigation (Authenticated)
 */
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.xs,
          marginTop: -8,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyQueues"
        component={QueuesStack}
        options={{
          tabBarLabel: 'Minhas Filas',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Auth Stack Navigator
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
};

/**
 * Root Navigator - Conditional based on auth state
 */
export const RootNavigator = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};


