'use client';

import axios from 'axios';
import qs from 'qs';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
});

apiClient.interceptors.request.use((axiosConfig) => {
  if (typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
    axiosConfig.headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
  }
  return axiosConfig;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window !== 'undefined' && error.response?.data) {
      const { toast } = await import('react-toastify');
      if (error.response.data instanceof Blob && error.response.data.type === 'application/json') {
        toast.error(JSON.parse(await error.response.data.text()));
      } else {
        toast.error(error.response.data?.message);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
