import axios from 'axios';
import { baseUrl } from './GlobalVariables';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error?.config;

    // Check if error response status is 401 and request has not been retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If refreshing is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh');
      const currentAccessToken = localStorage.getItem('access');

      // If no refresh token is available, clear tokens & redirect to login
      if (!refreshToken) {
        isRefreshing = false;
        toast.error("Session expired, please log in again");
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token using custom backend endpoint requirements
        const response = await axios.post(`${baseUrl}/accounts/v1/authentication/token/refresh/`, {
          refresh: refreshToken,
          last_access_token: currentAccessToken,
          app_name: 'dotz_erp',
        });

        const { access, refresh: newRefreshToken } = response.data || {};

        if (!access) {
          throw new Error('No access token returned from refresh endpoint');
        }

        // Store new tokens
        localStorage.setItem('access', access);
        if (newRefreshToken) {
          localStorage.setItem('refresh', newRefreshToken);
        }

        // Update default header for future requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        processQueue(null, access);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('Refresh token failed:', refreshError);
        toast.error("Session expired, please log in again");
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;