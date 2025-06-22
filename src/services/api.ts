import axios from 'axios';

const API_BASE_URL = 'https://tnp-recruitment-challenge.manitvig.live';

export const loginUserApi = async (username: string, password: string) => {
  const data = JSON.stringify({
    username,
    password
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_BASE_URL}/login`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  const response = await axios.request(config);
  return response.data; 
};

export const generateShareTokenApi = async (accessToken: string) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_BASE_URL}/share`, 
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };

  const response = await axios.request(config);
  return response.data; 
};

export const refreshAccessTokenApi = async (refreshToken: string) => {
  const data = JSON.stringify({
    refreshToken
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_BASE_URL}/refresh`, 
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  const response = await axios.request(config);
  return response.data; 
};

export const getSharedStudentDataApi = async (shareToken: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${API_BASE_URL}/share?shareToken=${shareToken}`,
    headers: { } 
  };

  const response = await axios.request(config);
  return response.data; 
};