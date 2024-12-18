import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../GlobalStateContext.js";
import wadi_degla_logo_login from "../Assets/wadi-degla-logo-login.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // State to hold field-specific errors
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setGlobalState } = useGlobalState(); // Access global state for user data

  // Email validation regex
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password validation (at least 8 characters, one letter, one number)
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleLogin = async () => {
    let validationErrors = {};
    // Validate inputs
    if (!validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (!validatePassword(password)) {
      validationErrors.password =
        "Password must be at least 8 characters, including uppercase, lowercase, number, and special character.";
    }

    // If there are validation errors, update state and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    // Clear errors and proceed with API request
    setErrors({});
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/customer/login",
        { email, password },
        { withCredentials: true } // Include cookies in requests
      );

      if (response.status === 200 || response.status === 201) {
        // Update global state with user data
        setGlobalState({
          isLoggedIn: true,
          ...response.data, // Spread all fields from response.data
        });

        setMessage("Login successful!");
        navigate("/");
      }
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Login failed. Please try again." });
      setMessage("");
    }
  };

  return (
    <div className="container-big">
      <div className="container1">
        <div className="container1-title">
          <h1>Wadi Degla</h1>
          <h3>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum</h3>
        </div>
        <div className="container1-img">
          <img src={wadi_degla_logo_login} alt="Wadi Degla Logo" />
        </div>
      </div>
      <div className="container2">
        <div className="head">
          <h1>Login</h1>
          <p>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum!</p>
          <div className="underline"></div>
        </div>
        <form
          className="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="input-field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {errors.general && (
            <p className="error" style={{ color: "red" }}>
              {errors.general}
            </p>
          )}
          {message && <p className="success">{message}</p>}

          <div className="submit">
            <button className="btn1">LOGIN</button>
            <div className="forgot-password">
              Don't have an account?
              <Link to="/signup">
                <span>Register</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
