import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('refreshToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during registration' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during logout' };
  }
}; 