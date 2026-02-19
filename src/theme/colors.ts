/**
 * Theme - Colors
 * Color palette for the Filae app
 */

export const colors = {
  // Primary colors
  primary: '#6200EE',       // Deep purple - main brand color
  primaryDark: '#3700B3',   // Darker purple
  primaryLight: '#BB86FC',  // Light purple

  // Secondary colors
  secondary: '#03DAC6',     // Teal
  secondaryDark: '#018786', // Dark teal

  // Neutral colors
  background: '#FFFFFF',    // White background
  surface: '#FFFFFF',       // Card/surface background

  // Text colors
  text: '#000000',          // Primary text (black)
  textSecondary: '#666666', // Secondary text (gray)
  textDisabled: '#9E9E9E',  // Disabled text
  textOnPrimary: '#FFFFFF', // Text on primary color

  // Status colors
  error: '#B00020',         // Error red
  success: '#4CAF50',       // Success green
  warning: '#FF9800',       // Warning orange
  info: '#2196F3',          // Info blue

  // Border and divider
  border: '#E0E0E0',        // Border gray
  divider: '#BDBDBD',       // Divider gray

  // Special
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  disabled: '#F5F5F5',      // Disabled background

  // Queue status colors
  queueWaiting: '#FFC107',  // Amber
  queueCalled: '#4CAF50',   // Green
  queueFinished: '#9E9E9E', // Gray
  queueCancelled: '#F44336', // Red
} as const;

export type ColorKey = keyof typeof colors;

export default colors;

