import './App.css';
import React from 'react';
import Signup from './Components/LoginSignup/Signup.js';
import Login from './Components/LoginSignup/Login.js';
import Gallery from './Components/Gallery/Gallery.js';
import About from './Components/About/About.js';
import Home from './Components/Home/Home.js';
import Navbar from './Components/Navbar/Navbar.js';
import Footer from './Components/Footer/Footer.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';





function App() {
  return (
    <BrowserRouter>
      
        
      <div className='main'>
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/signup" element={<Signup/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/about" element={<About/>}/>
          <Route exact path="/gallery" element={<Gallery/>}/>
        </Routes>
        <Footer/>
      </div>
        
      
    </BrowserRouter>
    //<LoginSignup/>
    //<Home/>
  );
}

export default App;
