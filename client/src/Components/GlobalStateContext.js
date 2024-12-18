import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    isLoggedIn: false,
    id: "",
    fullName: "",
    companyName: "",
    rnc: "",
    email: "",
    phone: "",
    whatsapp: "",
    country: "",
    address: "",
    port: "",
  });

  // Fetch user data on app initialization
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/customer/me", // Adjust the endpoint
          { withCredentials: true }
        );

        if (response.status === 200) {
          setGlobalState({
            isLoggedIn: true,
            ...response.data,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err.response?.data || err.message);
        setGlobalState({ isLoggedIn: false }); // Reset state on failure
      }
    };

    fetchUserData();
  }, []);

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
