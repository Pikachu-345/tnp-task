export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  IS_AUTHENTICATED: 'isAuthenticated', 
};

export const API_ENDPOINTS = {
  LOGIN: '/login',
  SHARE: '/share',
  REFRESH: '/refresh',
  GET_SHARED_DATA: '/share', 
};

export const ENV_VARS = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};