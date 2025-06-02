import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    // You can add any request configuration here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios; 