import axios from 'axios';

// 1. Create a configured instance
const api = axios.create({
  baseURL: 'http://localhost:5169', // Your C# Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. The Interceptor (The "Middleman")
// Before every request, check if we have a token and attach it.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;