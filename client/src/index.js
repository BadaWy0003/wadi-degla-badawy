import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GlobalStateProvider } from './Components/GlobalStateContext.js';
import { HelmetProvider } from 'react-helmet-async';
//import { BrowserRouter } from 'react-router-dom';
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <HelmetProvider>
                <GlobalStateProvider>
                        <App />
                </GlobalStateProvider>
        </HelmetProvider>
);


