/**
 * Example Usage Component
 * Demonstrates how to use the Filae services in React components
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import {
  AuthService,
  EstablishmentService,
  QueueService,
  FavoriteService,
} from '../services';
import { Establishment, Queue } from '../types';

export const ServiceExampleScreen: React.FC = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [myQueues, setMyQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(false);

  // Example 1: Load establishments on mount
  useEffect(() => {
    loadEstablishments();
  }, []);

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      const data = await EstablishmentService.getEstablishments({
        category: 'restaurant',
      });
      setEstablishments(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Login
  const handleLogin = async () => {
    try {
      const { user, token } = await AuthService.login({
        email: 'alice@example.com',
        password: 'SecurePass123!',
      });

      Alert.alert('Success', `Welcome ${user.name}!`);

      // Load user's queues after login
      loadMyQueues();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  // Example 3: Join queue
  const handleJoinQueue = async (establishmentId: number) => {
    try {
      // Check if already in queue
      const existingQueue = await QueueService.hasActiveQueueAt(establishmentId);

      if (existingQueue) {
        Alert.alert('Already in Queue', `Your ticket: ${existingQueue.ticketNumber}`);
        return;
      }

      // Join the queue
      const { queue } = await QueueService.joinQueue({
        establishmentId,
        partySize: 2,
      });

      Alert.alert(
        'Joined Queue!',
        `Ticket: ${queue.ticketNumber}\nPosition: ${queue.position}\nWait: ~${queue.estimatedWaitTime} min`
      );

      loadMyQueues();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Example 4: Load my queues
  const loadMyQueues = async () => {
    try {
      const { activeQueues } = await QueueService.getMyQueues();
      setMyQueues(activeQueues);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Example 5: Toggle favorite
  const handleToggleFavorite = async (establishmentId: number) => {
    try {
      const isFavorited = await FavoriteService.toggleFavorite(establishmentId);
      Alert.alert(
        isFavorited ? '⭐ Added to Favorites' : 'Removed from Favorites'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Example 6: Cancel queue
  const handleCancelQueue = async (queueId: number) => {
    try {
      await QueueService.cancelQueue(queueId);
      Alert.alert('Queue Cancelled');
      loadMyQueues();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filae Service Layer Examples</Text>

      {/* Login Button */}
      <Button title="Login as Alice" onPress={handleLogin} />

      {/* Establishments List */}
      <Text style={styles.sectionTitle}>Restaurants</Text>
      <FlatList
        data={establishments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text>Wait: ~{item.estimatedWaitTime} min</Text>
            <Text>Queue: {item.currentQueueSize} people</Text>
            <View style={styles.buttons}>
              <Button
                title="Join Queue"
                onPress={() => handleJoinQueue(item.id)}
              />
              <Button
                title="⭐"
                onPress={() => handleToggleFavorite(item.id)}
              />
            </View>
          </View>
        )}
      />

      {/* My Queues */}
      <Text style={styles.sectionTitle}>My Active Queues</Text>
      <FlatList
        data={myQueues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>Ticket: {item.ticketNumber}</Text>
            <Text>{item.establishmentName}</Text>
            <Text>Position: {item.position}</Text>
            <Text>Status: {item.status}</Text>
            <Button
              title="Cancel"
              onPress={() => handleCancelQueue(item.id)}
              color="red"
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
});

