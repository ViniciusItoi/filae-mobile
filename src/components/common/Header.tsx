/**
 * Header Component
 * Reusable header with search, profile menu and navigation
 * Encapsulates all profile menu logic and search functionality
 */

import React, { useState } from 'react';
import { TopHeaderCard } from './TopHeaderCard';

interface HeaderProps {
  // Search props
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchSubmit?: () => void;
  searchPlaceholder?: string;

  // Profile menu navigation handlers
  onProfileMenuGoProfile?: () => void;
  onProfileMenuGoQueues?: () => void; // For MERCHANT only - manage their queues
  onProfileMenuGoMyQueues?: () => void; // For CUSTOMER - view queues they're in
  onProfileMenuLogout?: () => void;

  // Logo navigation handler
  onLogoPress?: () => void;

  // Visibility flags
  showSearchInput?: boolean;
  showProfileButton?: boolean;
}

/**
 * Header Component - Encapsulates TopHeaderCard with full profile menu logic
 * Handles all menu state internally, simplifies usage across screens
 */
export const Header: React.FC<HeaderProps> = ({
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Buscar estabelecimento...',
  onProfileMenuGoProfile,
  onProfileMenuGoQueues, // MERCHANT only
  onProfileMenuGoMyQueues, // CUSTOMER only
  onProfileMenuLogout,
  onLogoPress,
  showSearchInput = true,
  showProfileButton = true,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfilePress = () => {
    console.log('👤 [Header] Profile button pressed!');
    console.log('👤 [Header] Current showProfileMenu state:', showProfileMenu);
    setShowProfileMenu(!showProfileMenu);
    console.log('👤 [Header] showProfileMenu set to:', !showProfileMenu);
  };

  const handleCloseProfileMenu = () => {
    console.log('❌ [Header] Closing profile menu');
    setShowProfileMenu(false);
  };

  const handleProfileMenuGoProfile = () => {
    console.log('➡️ [Header] Navigate to profile');
    setShowProfileMenu(false);
    onProfileMenuGoProfile?.();
  };

  const handleProfileMenuGoQueues = () => {
    console.log('➡️ [Header] Navigate to manage queues (MERCHANT)');
    setShowProfileMenu(false);
    onProfileMenuGoQueues?.();
  };

  const handleProfileMenuGoMyQueues = () => {
    console.log('➡️ [Header] Navigate to my queues (CUSTOMER)');
    setShowProfileMenu(false);
    onProfileMenuGoMyQueues?.();
  };

  const handleProfileMenuLogout = async () => {
    console.log('🚪 [Header] Logout');
    setShowProfileMenu(false);
    await onProfileMenuLogout?.();
  };

  return (
    <TopHeaderCard
      tagline="Pule a fila, sempre"
      searchPlaceholder={searchPlaceholder}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onSearchSubmit={onSearchSubmit}
      onLogoPress={onLogoPress}
      onProfilePress={handleProfilePress}
      showProfileMenu={showProfileMenu}
      onCloseProfileMenu={handleCloseProfileMenu}
      onProfileMenuGoProfile={handleProfileMenuGoProfile}
      onProfileMenuGoQueues={handleProfileMenuGoQueues}
      onProfileMenuGoMyQueues={handleProfileMenuGoMyQueues}
      onProfileMenuLogout={handleProfileMenuLogout}
      showSearchInput={showSearchInput}
      showProfileButton={showProfileButton}
    />
  );
};

export default Header;

