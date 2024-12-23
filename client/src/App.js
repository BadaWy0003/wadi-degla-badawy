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
import Contact from "./Components/Contact/Contact.js";
import MyAccount from "./Components/MyAccount/MyAccount.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="main">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/gallery" element={<Gallery />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/visualizer" element={<Visualizer />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/my account" element={<MyAccount />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
