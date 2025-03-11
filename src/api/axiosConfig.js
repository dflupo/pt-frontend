import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the authentication token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Redirect to login page if needed
        // window.location.href = '/login';
      }
      
      // You can add other error handling as needed
      if (error.response.status === 422) {
        console.error('Validation Error:', error.response.data.detail);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;