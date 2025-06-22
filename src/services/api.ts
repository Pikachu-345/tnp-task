import axios from 'axios';
import { STORAGE_KEYS, API_ENDPOINTS, ENV_VARS } from '@/constants';

const api = axios.create({
  baseURL: ENV_VARS.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, 
});

api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest.url !== `<span class="math-inline">\{ENV\_VARS\.API\_BASE\_URL\}</span>{API_ENDPOINTS.REFRESH}` &&
      !originalRequest._retry 
    ) {
      originalRequest._retry = true; 
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `<span class="math-inline">\{ENV\_VARS\.API\_BASE\_URL\}</span>{API_ENDPOINTS.REFRESH}`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

          sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); 
        } catch (refreshError) {
          sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          window.location.href = '/login'; 
          return Promise.reject(refreshError);
        }
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = '/login'; 
        return Promise.reject(error);
      }
    }
    return Promise.reject(error); 
  }
);

export const loginUserApi = async (username: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, { username, password });
    return response.data;
};

export const generateShareTokenApi = async () => { 
    const response = await api.post(API_ENDPOINTS.SHARE);
    return response.data;
};

export const refreshAccessTokenApi = async (refreshToken: string) => {
    const response = await api.post(API_ENDPOINTS.REFRESH, { refreshToken });
    return response.data;
};

export const getSharedStudentDataApi = async (shareToken: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${ENV_VARS.API_BASE_URL}/share?shareToken=${shareToken}`,
    headers: { } 
  };

  const response = await axios.request(config);
  return response.data; 
};

export default api;