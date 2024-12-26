import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/layout/Layout.js';
import Dashboard from './components/dashboard/Dashboard';
import Products from './components/products/Products';
import Gallery from './components/gallery/Gallery';
import Users from './components/users/Users';
import Customers from './components/customers/Customers';
import Login from './components/auth/Login';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="users" element={<Users />} />
            <Route path="customers" element={<Customers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;