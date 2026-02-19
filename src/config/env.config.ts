/**
 * Environment Configuration
 * Configure this file based on your testing environment
 */

export const ENV_CONFIG = {
  // Set your machine's IP address here if testing on physical device
  // To find your IP:
  // - Windows: Open cmd and type: ipconfig
  // - Mac/Linux: Open terminal and type: ifconfig
  // Look for IPv4 address (e.g., 192.168.1.100)
  PHYSICAL_DEVICE_IP: '192.168.68.105', // Your machine's IP for physical device

  // Backend server configuration
  BACKEND_HOST: 'localhost', // Your backend host
  BACKEND_PORT: 8080, // Your backend port

  // API path prefix - Backend uses /api prefix
  API_PREFIX: '/api', // Endpoints are at localhost:8080/api/...
} as const;

export default ENV_CONFIG;

