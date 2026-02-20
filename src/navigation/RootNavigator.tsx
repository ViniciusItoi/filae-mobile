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
import { SearchEstablishmentsScreen } from '../screens/home/SearchEstablishmentsScreen';
import { EstablishmentDetailsScreen } from '../screens/establishment/EstablishmentDetailsScreen';
import { CreateQueueScreen } from '../screens/queue/CreateQueueScreen';
import { MyQueuesScreen } from '../screens/queue/MyQueuesScreen';
import { ManageQueuesScreen } from '../screens/queue/ManageQueuesScreen';
import { EditQueueScreen } from '../screens/queue/EditQueueScreen';
import { ProfileScreen, EditProfileScreen } from '../screens/profile';
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
        headerShown: false,
      }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchEstablishments"
        component={SearchEstablishmentsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EstablishmentDetails"
        component={EstablishmentDetailsScreen}
      />
      <Stack.Screen
        name="CreateQueue"
        component={CreateQueueScreen}
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
        headerShown: false,
      }}>
      <Stack.Screen
        name="MyQueuesMain"
        component={MyQueuesScreen}
      />
      <Stack.Screen
        name="EstablishmentDetails"
        component={EstablishmentDetailsScreen}
      />
      <Stack.Screen
        name="EditQueue"
        component={EditQueueScreen}
      />
      <Stack.Screen
        name="CreateQueue"
        component={CreateQueueScreen}
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
        headerShown: false,
      }}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
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
        tabBarStyle: { display: 'none' },
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

