import React, { createContext, useContext, useState } from 'react';

// Create a Context
const GlobalStateContext = createContext();

// Create a Provider Component
export const GlobalStateProvider = ({ children }) => {
    const [globalState, setGlobalState] = useState({
        user: null,
        isLoggedIn: true,
    });

    return (
        <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// Custom Hook for using the Global State
export const useGlobalState = () => useContext(GlobalStateContext);
