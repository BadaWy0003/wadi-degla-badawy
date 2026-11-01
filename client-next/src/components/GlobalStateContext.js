'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../util/client';

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
        const { data } = await apiClient.get(`/api/auth/customer/check-auth`);

        setGlobalState({
          isLoggedIn: true,
          ...data,
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err.response?.data || err.message);
        setGlobalState({ isLoggedIn: false });
        localStorage.removeItem('auth_token');
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
