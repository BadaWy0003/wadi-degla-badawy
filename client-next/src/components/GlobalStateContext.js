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
      // Only ask the API when this browser has a login token. The auth cookie is never
      // sent cross-site (site and API are on different domains), so without a token the
      // answer is always 401: that was one failed request + one server log line per page view.
      let token = null;
      try {
        token = localStorage.getItem('auth_token');
      } catch {
        // storage blocked (private mode etc.): treat as logged out
      }
      if (!token) {
        setGlobalState((prev) => ({ ...prev, isLoggedIn: false }));
        setLoading(false);
        return;
      }

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
