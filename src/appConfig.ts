/**
 * Learning App - Application Configuration
 *
 * Central configuration for the application.
 * Update these values when connecting to a different backend.
 */

export const appConfig = {
  /** Base URL of the backend API server */
  baseUrl: 'https://straight-finally-mary-assisted.trycloudflare.com',

  /** Authentication token for API requests */
  accessToken: 'dummy-token',

  /** Application version */
  appVersion: '1.0.0',
};

/**
 * Set to true to use mock data for all API calls.
 * Set to false to call real backend API endpoints.
 */
export const USE_MOCK = true;
