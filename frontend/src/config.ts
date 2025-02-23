/**
 * Application configuration
 */
export const config = {
  /**
   * Backend API URL
   * @default http://localhost:3000
   */
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  
  /**
   * API version prefix
   */
  API_VERSION: 'v1',

  /**
   * Polling interval for task updates (in milliseconds)
   * @default 10000 (10 seconds)
   */
  POLLING_INTERVAL: 10000,
} as const;