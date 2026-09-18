import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('gangster_user');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Error parsing user token', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler helper
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
