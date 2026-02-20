/**
 * TopHeaderCard
 * Shared purple header with logo, tagline, search box, and profile icon.
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Avatar } from './Avatar';
import { useAuth } from '../../contexts/AuthContext';

interface TopHeaderCardProps {
  tagline: string;
  searchPlaceholder: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchSubmit?: () => void;
  onLogoPress?: () => void;
  onProfilePress?: () => void;
  showProfileMenu?: boolean;
  onCloseProfileMenu?: () => void;
  onProfileMenuGoProfile?: () => void;
  onProfileMenuGoQueues?: () => void; // MERCHANT - manage queues
  onProfileMenuGoMyQueues?: () => void; // CUSTOMER - view my queues
  onProfileMenuLogout?: () => void;
  showSearchInput?: boolean;
  showProfileButton?: boolean;
}

export const TopHeaderCard: React.FC<TopHeaderCardProps> = ({
  tagline,
  searchPlaceholder,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  onLogoPress,
  onProfilePress,
  showProfileMenu = false,
  onCloseProfileMenu,
  onProfileMenuGoProfile,
  onProfileMenuGoQueues, // MERCHANT
  onProfileMenuGoMyQueues, // CUSTOMER
  onProfileMenuLogout,
  showSearchInput = true,
  showProfileButton = true,
}) => {
  const { user } = useAuth();

  // Determine if user is a merchant
  const isMerchant = user?.userType === 'MERCHANT';
  const isCustomer = user?.userType === 'CUSTOMER';

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={onLogoPress}
            activeOpacity={0.7}
            style={styles.logoContainer}
          >
            <Image
              source={require('../../assets/images/FILA[e] - Logo Branco Amarelo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {showProfileButton && (
            <View style={styles.profileButtonWrapper}>
              <TouchableOpacity
                style={styles.profileIconButton}
                onPress={() => {
                  console.log('👤 Profile icon pressed! showProfileMenu will be:', !showProfileMenu);
                  onProfilePress?.();
                }}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Avatar
                  name={user?.name}
                  imageUrl={user?.profilePictureUrl}
                  size="medium"
                  backgroundColor="rgba(98, 0, 238, 0.3)"
                  textColor="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={onLogoPress}
          activeOpacity={0.7}
        >
          <Text style={styles.tagline}>{tagline}</Text>
        </TouchableOpacity>
        {showSearchInput && (
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor="#CCCCCC"
              value={searchValue}
              onChangeText={onSearchChange}
              onSubmitEditing={onSearchSubmit}
              editable={true}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>
        )}
      </View>

      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu === true}
        transparent={true}
        animationType="fade"
        onRequestClose={onCloseProfileMenu}
        hardwareAccelerated={true}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onCloseProfileMenu}
          pointerEvents="box-none"
        >
          <View style={[styles.profileMenu, { pointerEvents: 'auto' }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onProfileMenuGoProfile}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>Meu Perfil</Text>
            </TouchableOpacity>

            {/* Show different queue option based on user type */}
            {isMerchant && onProfileMenuGoQueues && (
              <>
                <View style={styles.menuDivider} />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={onProfileMenuGoQueues}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuItemText}>Gerenciar Filas</Text>
                </TouchableOpacity>
              </>
            )}

            {isCustomer && onProfileMenuGoMyQueues && (
              <>
                <View style={styles.menuDivider} />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={onProfileMenuGoMyQueues}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuItemText}>Minhas Filas</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onProfileMenuLogout}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, styles.logoutText]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 0,
    paddingTop: 0,
    zIndex: 10,
  },
  headerCard: {
    backgroundColor: '#2D006E',
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'flex-start',
  },
  headerTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    paddingRight: 12,
  },
  logo: {
    width: 120,
    height: 55,
  },
  profileButtonWrapper: {
    zIndex: 100,
  },
  profileIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'DM Sans',
    marginBottom: 16,
    textAlign: 'left',
  },
  searchBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#1A1A1A',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'DM Sans',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  searchText: {
    fontSize: 16,
    color: '#717171',
    fontFamily: 'DM Sans',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 9999,
  },
  profileMenu: {
    marginTop: 60,
    marginRight: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 9999,
    zIndex: 10000,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'DM Sans',
    color: '#1A1A1A',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  logoutText: {
    color: '#EF4444',
  },
});

