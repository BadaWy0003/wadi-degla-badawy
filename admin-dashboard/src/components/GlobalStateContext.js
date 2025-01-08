import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

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
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/auth/admin/check-auth`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setGlobalState({
            isLoggedIn: true,
            ...response.data,
          });
        }
      } catch (err) {
        console.error(
          "Failed to fetch user data:",
          err.response?.data || err.message
        );
        setGlobalState({ isLoggedIn: false });
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
