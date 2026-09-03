import axios from 'axios';
import { baseUrl } from './GlobalVariables';
import toast from 'react-hot-toast';

const axiosInstanceUser = axios.create({
  baseURL: baseUrl, // or your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token to headers
axiosInstanceUser.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log("Errror98765==>", error);
    
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and refresh token
axiosInstanceUser.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("error--123456==>",error);
    
    const originalRequest = error.config;
    

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem('refresh');

        console.log("Enter==refreshToken==>",refreshToken);
        

        // If no refresh token is available, redirect to login
        if (!refreshToken) {
          toast.error("Session expired, please log in again");
          // window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log("ENTER HRER 57");
        

        const response = await axios.post(`${baseUrl}/accounts/v1/authentication/token/refresh/`, {
          refresh: refreshToken,
        });
        console.log("enter==response==>",response);
        

        const { access } = response.data;

        // Store new access token
        localStorage.setItem('access', access);

        // Update the original request's authorization header
        axiosInstanceUser.defaults.headers['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        // Retry the original request with the new access token
        return axiosInstanceUser(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error (e.g., redirect to login)
        console.log("refreshError===>",refreshError);
        
        console.log('Refresh token expired, redirecting to login...');
        toast.error("Session expired, please log in again");
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        // window.location.href = '/login';
        toast.error("Something went wrong on your authentication ERR:1001");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstanceUser;