/**
 * Home Screen
 * List of establishments with search and filter functionality
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { EstablishmentService } from '../../services';
import { Establishment } from '../../types';
import {
  SearchBar,
  Chip,
  EmptyState,
  LoadingSpinner,
} from '../../components/common';
import { EstablishmentCard } from '../../components/establishment';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Load establishments on mount
  useEffect(() => {
    loadEstablishments();
  }, []);

  // Filter establishments when search or category changes
  useEffect(() => {
    filterEstablishments();
  }, [searchQuery, selectedCategory, establishments]);

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      const data = await EstablishmentService.getEstablishments();
      setEstablishments(data);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map(e => e.category))
      ).sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEstablishments();
    setRefreshing(false);
  };

  const filterEstablishments = () => {
    let filtered = [...establishments];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    setFilteredEstablishments(filtered);
  };

  const handleEstablishmentPress = (establishment: Establishment) => {
    navigation.navigate('EstablishmentDetails', { establishment });
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} message="Carregando estabelecimentos..." />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <ScrollView
        scrollEnabled={false}
        style={styles.searchContainer}
        showsVerticalScrollIndicator={false}>
        <SearchBar
          placeholder="Buscar estabelecimento..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          showClear={searchQuery.length > 0}
        />

        {/* Category Filters */}
        <View style={styles.categoriesContainer}>
          <Chip
            label="Todos"
            selected={selectedCategory === null}
            onPress={() => setSelectedCategory(null)}
          />
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Establishments List */}
      {filteredEstablishments.length > 0 ? (
        <FlatList
          data={filteredEstablishments}
          renderItem={({ item }) => (
            <EstablishmentCard
              establishment={item}
              onPress={() => handleEstablishmentPress(item)}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        <EmptyState
          icon="🔍"
          title="Nenhum estabelecimento encontrado"
          message={
            searchQuery || selectedCategory
              ? 'Tente uma busca diferente ou outro filtro'
              : 'Nenhum estabelecimento disponível no momento'
          }
          actionLabel="Limpar filtros"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  listContent: {
    padding: spacing.md,
    paddingTop: spacing.md,
  },
});

