import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../util/client";

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    isLoggedIn: false,
    id: "",
    username: "",
    email: "",
    token: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get(`/api/auth/admin/check-auth`);
        setGlobalState({
          isLoggedIn: true,
          ...response.data,
        });
      } catch (err) {
        localStorage.removeItem("auth_token");
        setGlobalState({ isLoggedIn: false });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{ globalState, setGlobalState, loading }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
