'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiClient } from '../util/api-lazy';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    isLoggedIn: false,
    id: '',
    fullName: '',
    companyName: '',
    rnc: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: '',
    address: '',
    port: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(`/api/auth/customer/check-auth`);
        setGlobalState({ isLoggedIn: true, ...data });
      } catch (err) {
        console.error('Failed to fetch user data:', err.response?.data || err.message);
        setGlobalState({ isLoggedIn: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState, loading }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
