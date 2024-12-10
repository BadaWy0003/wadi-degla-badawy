import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import password_eye_hidden_icon from "../Assets/Icons/password-eye-hidden.svg";
import wadi_degla_logo_login from "../Assets/wadi-degla-logo-login.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

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
      console.log(response);

      setMessage(response.data.message);
      setError(null);
      // Save token to local storage
      localStorage.setItem("token", response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setMessage("");
    }
  };

  return (
    <div className="container-big">
      <div className="container1">
        <h1>Wadi Degla</h1>
        <p>Join us by filling the following form</p>
        <img src={wadi_degla_logo_login} alt="" />
      </div>
      <div className="container2">
        <div className="head">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <p>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input">
            <div className="pass">
              <p>Password</p>
              <img src={password_eye_hidden_icon} alt="" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
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
