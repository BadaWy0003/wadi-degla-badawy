import React, { createContext, useContext, useState } from "react";

// Create a Context
const GlobalStateContext = createContext();

// Create a Provider Component
export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState(() => {
    // Load initial state from localStorage if available
    const savedUserData = localStorage.getItem("userData");
    return savedUserData
      ? { ...JSON.parse(savedUserData), isLoggedIn: true }
      : {
          isLoggedIn: false,
          token: null,
          fullName: "",
          companyName: "",
          rnc: "",
          email: "",
          phone: "",
          whatsapp: "",
          country: "",
          countryCode: "",
          address: "",
          port: "",
        };
  });

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};


// Custom Hook for using the Global State
export const useGlobalState = () => useContext(GlobalStateContext);
