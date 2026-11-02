import axios from 'axios';
import qs from 'qs';
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  withCredentials: true,
  paramsSerializer: {
    serialize: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
});

apiClient.interceptors.request.use(axiosConfig => {
  if (localStorage.getItem('auth_token')) {
    axiosConfig.headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
  }

  return axiosConfig;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    // Session ended (logged out on another device, password reset, or expired):
    // go back to the login page instead of leaving a half-working screen.
    const isLoginRequest = error.config?.url?.includes('/api/auth/admin/login');
    if (error.response?.status === 401 && !isLoginRequest && localStorage.getItem('auth_token')) {
      localStorage.removeItem('auth_token');
      window.location.assign('/login');
      return Promise.reject(error);
    }
    if (error.response?.data) {
      if (error.response.data instanceof Blob && error.response.data.type === 'application/json') {
        toast.error(JSON.parse(await error.response.data.text()));
      } else {
        toast.error(error.response.data?.message);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
