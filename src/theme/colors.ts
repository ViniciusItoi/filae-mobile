/**
 * Theme - Colors
 * Centralized color palette for the entire Filae app
 */

export const colors = {
  // Primary colors
  primary: '#6200EE',       // Deep purple - main brand color
  primaryDark: '#3700B3',   // Darker purple
  primaryLight: '#BB86FC',  // Light purple
  purple: '#2D006E',        // Dark purple from prototype (also used for profile cards)
  purpleGradientEnd: '#4A0FA0', // Purple gradient end

  // Secondary colors
  secondary: '#03DAC6',     // Teal
  secondaryDark: '#018786', // Dark teal

  // Background colors
  background: '#FFFFFF',    // White background (default)
  backgroundLight: '#FAFAFA', // Light gray background (profile screens)
  surface: '#FFFFFF',       // Card/surface background

  // Text colors
  text: '#000000',          // Primary text (black)
  textSecondary: '#666666', // Secondary text (gray)
  textDisabled: '#9E9E9E',  // Disabled text
  textOnPrimary: '#FFFFFF', // Text on primary color
  textOnPurple: '#FFFFFF',  // Text on purple cards
  textSecondaryLight: 'rgba(255, 255, 255, 0.7)', // Secondary text on dark bg
  textDisabledLight: 'rgba(255, 255, 255, 0.5)', // Disabled text on dark bg

  // Status colors
  error: '#B00020',         // Error red
  errorLight: '#FF6B6B',    // Light error red (for buttons/borders)
  success: '#4CAF50',       // Success green
  warning: '#FF9800',       // Warning orange
  info: '#2196F3',          // Info blue

  // Border and divider
  border: '#E0E0E0',        // Border gray
  borderPurple: '#2D006E',  // Purple border
  borderRed: '#FF6B6B',     // Red border
  divider: '#BDBDBD',       // Divider gray

  // Special
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  disabled: '#F5F5F5',      // Disabled background
  fieldBackground: 'rgba(255, 255, 255, 0.1)', // Field background on dark
  fieldBorder: 'rgba(255, 255, 255, 0.2)', // Field border on dark

  // Queue status colors
  queueWaiting: '#FFC107',  // Amber
  queueCalled: '#4CAF50',   // Green
  queueFinished: '#9E9E9E', // Gray
  queueCancelled: '#F44336', // Red

  // Button colors
  buttonPrimary: '#2D006E',    // Primary button color (purple)
  buttonSecondaryBorder: '#2D006E', // Secondary button border
  buttonDeleteBorder: '#FF6B6B',     // Delete button border
} as const;

export type ColorKey = keyof typeof colors;

export default colors;

