// src/services/http.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'}`,
  timeout: 10000,
});
