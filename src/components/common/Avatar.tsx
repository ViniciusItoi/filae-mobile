/**
 * Avatar Component
 * User profile picture or placeholder with initials
 */

import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme';

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 'medium',
  style,
  backgroundColor = colors.primary,
  textColor = colors.textOnPrimary,
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  // Get dimensions based on size
  const getSizeDimensions = (s: string) => {
    switch (s) {
      case 'small':
        return { container: 32, font: 12 };
      case 'medium':
        return { container: 48, font: 18 };
      case 'large':
        return { container: 80, font: 28 };
      default:
        return { container: 48, font: 18 };
    }
  };

  const dimensions = getSizeDimensions(size);

  // Calculate initials
  const getInitials = () => {
    if (!name || name.trim().length === 0) {
      return '?';
    }
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials();

  // Show initials if no image or image failed to load
  const showInitials = !imageUrl || imageLoadError;

  return (
    <View
      style={{
        width: dimensions.container,
        height: dimensions.container,
        borderRadius: dimensions.container / 2,
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      {imageUrl && !imageLoadError && (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: dimensions.container,
            height: dimensions.container,
            borderRadius: dimensions.container / 2,
          }}
          onError={() => {
            console.log('🖼️ [Avatar] IMAGE LOAD FAILED - showing initials instead');
            setImageLoadError(true);
          }}
        />
      )}

      {showInitials && (
        <Text
          style={{
            fontSize: dimensions.font,
            fontWeight: 'bold',
            color: textColor,
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {initials}
        </Text>
      )}
    </View>
  );
};


