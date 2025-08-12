// src/services/http.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE || 'https://api.safety-platform.edu/v1'}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 429) {
      // Handle rate limiting
      console.warn('Rate limit exceeded. Please wait before making more requests.');
    }
    
    return Promise.reject(error);
  }
);
