import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/layout/Layout.js';
import Dashboard from './components/dashboard/Dashboard';
import Products from './components/products/Products';
import Gallery from './components/gallery/Gallery';
import Users from './components/users/Users';
import Customers from './components/customers/Customers';
import Documents from './components/documents/Documents';
import News from './components/news/News';
import Projects from './components/projects/Projects';
import Login from './components/auth/Login';
import { ProtectedRoute } from './components/ProtectedRoute.js'; // Create this file as described earlier
import { useGlobalState } from './components/GlobalStateContext'; // Ensure this exists
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { globalState, loading } = useGlobalState();
  const isLoggedIn = globalState.isLoggedIn;

  // Wait for the login check before routing; otherwise a page refresh briefly looks
  // logged-out and sends the user to /login and then to the Dashboard.
  if (loading) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer autoClose={5000} hideProgressBar />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="users" element={<Users />} />
            <Route path="customers" element={<Customers />} />
            <Route path="documents" element={<Documents />} />
            <Route path="news" element={<News />} />
            <Route path="projects" element={<Projects />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
