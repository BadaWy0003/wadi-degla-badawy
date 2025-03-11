import "./App.css";
import React from "react";
import Signup from "./Components/LoginSignup/Signup.js";
import Login from "./Components/LoginSignup/Login.js";
import Gallery from "./Components/Gallery/Gallery.js";
import About from "./Components/About/About.js";
import Home from "./Components/Home/Home.js";
import Navbar from "./Components/Navbar/Navbar.js";
import Footer from "./Components/Footer/Footer.js";
import Products from "./Components/Products/Products.js";
import Visualizer from "./Components/Products/Visualizer.js";
import MyAccount from "./Components/MyAccount/MyAccount.js";
import Contact from "./Components/Contact/Contact.js";
import ProductDetails from "./Components/Products/ProductDetails.js";
import Exports from "./Components/Exports/Exports.js";
import Packing from "./Components/Packing/Packing.js";
import Partners from "./Components/Partners/Partners.js";
import News from "./Components/News/News.js";
import Machinery from "./Components/Machinery/Machinery.js";
import Quarries from "./Components/Quarries/Quarries.js";
import History from "./Components/History/History.js";
import Projects from "./Components/Projects/Projects.js";
import ProjectDetails from "./Components/Projects/ProjectDetails.js";
import Fairs from "./Components/Fairs/Fairs.js";
import Patterns from "./Components/Patterns/Patterns.js";
import { ToastContainer } from "react-toastify";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useGlobalState } from "./Components/GlobalStateContext"; // Ensure this exists
import { ProtectedRoute } from "./Components/ProtectedRoute"; // Create this file as described earlier

import "react-toastify/dist/ReactToastify.css";

function App() {
  const { globalState } = useGlobalState();
  const isLoggedIn = globalState.isLoggedIn;

  return (
    <BrowserRouter>
      <div className="main">
        <Navbar />
        <ToastContainer autoClose={5000} hideProgressBar />
        <Routes>
          {/* Public routes */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/history" element={<History />} />
          <Route exact path="/exports" element={<Exports />} />
          <Route exact path="/packing" element={<Packing />} />
          <Route exact path="/machinery" element={<Machinery />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/gallery" element={<Gallery />} />
          <Route exact path="/quarries" element={<Quarries />} />
          <Route exact path="/partners" element={<Partners />} />
          <Route exact path="/news" element={<News />} />
          <Route exact path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route exact path="/visualizer" element={<Visualizer />} />
          <Route exact path="/projects" element={<Projects />} />
          <Route exact path="/projects/:projectId" element={<ProjectDetails />} />
          <Route exact path="/fairs" element={<Fairs />} />
          <Route exact path="/patterns" element={<Patterns />} />
          <Route exact path="/contact" element={<Contact />} />

          {/* Protected routes for NOT logged-in users */}
          <Route
            exact
            path="/signup"
            element={
              <ProtectedRoute condition={!isLoggedIn} redirectTo="/my account">
                <Signup />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/login"
            element={
              <ProtectedRoute condition={!isLoggedIn} redirectTo="/my account">
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Protected routes for logged-in users */}
          <Route
            exact
            path="/my account"
            element={
              <ProtectedRoute condition={isLoggedIn} redirectTo="/login">
                <MyAccount />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
