import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import password_eye_hidden_icon from "../Assets/Icons/password-eye-hidden.svg";
import wadi_degla_logo_login from "../Assets/wadi-degla-logo-login.svg";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../GlobalStateContext.js';



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { globalState, setGlobalState } = useGlobalState(); // Access global state for user data

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation (at least 8 characters, one letter, one number)
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setMessage("");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, including uppercase leter, lowercase letter, number and a special character."
      );
      setMessage("");
      return;
    }

    // If validation passes, proceed with API request
    try {
      console.log(email, password);

      const response = await axios.post(
        "http://localhost:5000/api/auth/customer/login",
        { email, password },
        { withCredentials: true } // Include cookies in requests
      );

      if (response.status === 200 || response.status === 201) {
        const userData = {
          token: response.data.token,
          fullName: response.data.fullName,
          companyName: response.data.companyName,
          rnc: response.data.rnc,
          email: response.data.email,
          phone: response.data.phone,
          whatsapp: response.data.whatsapp,
          country: response.data.country,
          countryCode: response.data.countryCode,
          address: response.data.address,
          port: response.data.port,
        };
  
        // Save user data to localStorage
        // localStorage.setItem("userData", JSON.stringify(userData));
  
        // Update global state
        setGlobalState({
          ...globalState,
          isLoggedIn: true,
          ...userData,
        });
  
              // Navigate to the home page
              navigate("/");        
              window.scrollTo({top: 0, behavior: 'smooth'})
              
        
              // Store the token in a cookie for persistence
              Cookies.set("authToken", response.data.token, { secure: true, sameSite: "Strict" });

              // TESTING TO SEE THE globalState using console log ____________________________________________________
              // console.log("GlobalState.port: "+ globalState.port); 
              // console.log("LOGIN/////GlobalState.fullname: " + globalState.fullName + 
              //   " GlobalState.companyName: "+ globalState.companyName + " GlobalState.address: "
              //    + globalState.address + " GlobalState.whatsapp: " + globalState.whatsapp + 
              //   "GlobalState.port: "+ globalState.port + " GlobalState.isLoggedIn: " + globalState.isLoggedIn + 
              //   " GlobalState.token: "+globalState.token + " GlobalState.rnc: "+globalState.rnc + 
              //   " GlobalState.country: "+globalState.country + " GlobalState.countryCode: "+globalState.countryCode
              // +" GlobalState.email: "+globalState.email+" GlobalState.phone: "+globalState.phone);

              setMessage("Login successful!");
              setError(null);
        
              
              
      setMessage(response.data.message);
      setError(null);

      const token = Cookies;
      console.log(token);
    }} catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setMessage("");
    }
  };

  return (
    <div className="container-big">
      <div className="container1">
        <h1>Wadi Degla</h1>
        <p>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum</p>
        <img src={wadi_degla_logo_login} alt="" />
      </div>
      <div className="container2">
        <div className="head">
          <h1>Login</h1>
          <p>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum!</p>
          <div className="underline"></div>
        </div>
        
        <div className="input-field">
        <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
              {/* {error.email && <p className="error">{error.email}</p>} */}
            </div>

          <div className="input-field">
          <label htmlFor="password">Password</label>
          {/* <img src={password_eye_hidden_icon} alt="" /> */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* {error.password && <p className="error">{error.password}</p>} */}

        </div>

      
            

        {error && (
          <p className="error" style={{ color: "red" }}>
            {error}
          </p>
        )}
        {message && <p className="success">{message}</p>}

        <div className="submit-container">
          <button className="btn1" onClick={handleLogin}>
            LOGIN
          </button>
          <div className="forgot-password">
            Don't have an account?
            <Link to="/signup">
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
