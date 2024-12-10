import React, { createContext, useContext, useState } from 'react';

// Create a Context
const GlobalStateContext = createContext();

// Create a Provider Component
export const GlobalStateProvider = ({ children }) => {
    const [globalState, setGlobalState] = useState({
        user: null,
        fname: "Logged in user's name",
        cname: 'example company',
        rnc: 'example rnc',
        email: 'logged@in.user',
        phone: '01234567',
        whatsapp: '76543210',
        country: 'Canada',
        countryCode: '+1',
        address: '123 logged in dr. west, Ontario',
        port: 'example port',
        isLoggedIn: false,
    });

    return (
        <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// Custom Hook for using the Global State
export const useGlobalState = () => useContext(GlobalStateContext);
