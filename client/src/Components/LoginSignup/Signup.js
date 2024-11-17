import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import axios from "axios";

//import email_icon from '../Assets/Icons/email-icon.svg';
import password_eye_hidden_icon from "../Assets/Icons/password-eye-hidden.svg";
//import google_icon from '../Assets/Icons/google-logo.svg';
//import apple_icon from '../Assets/Icons/apple-logo.svg';
//import facebook_icon from '../Assets/Icons/facebook-logo.svg';
//import wadi_degla_icon from '../Assets/Icons/wadi-degla-logo-icon.svg';
import wadi_degla_logo_login from "../Assets/wadi-degla-logo-login.svg";
import { data } from "jquery";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false); // New state for terms checkbox
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z]{4,20}$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async () => {
    if (!username) {
      setError("Username is required.");
      return;
    }
    if (!validateUsername(username)) {
      setError("Username must be between 4 and 20 letters with no symbols");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, including uppercase leter, lowercase letter, number and a special character."
      );
      return;
    }
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/customer/register",
        {
          username,
          email,
          phone,
          password,
        }
      );
      if (response.ok) {
        setMessage(response.data.message);
        setError(null);
        console.log("ok");
      } else {
        setError(response.data.message);
        console.log("not ok");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong please try again"
      );
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
          <div className="text">Sign up</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <div className="enter-name">
              <div className="fname">
                <p>Username</p>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="input">
            <p>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input">
            <p>Phone number</p>
            <input
              type="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            <p className="pass-instructions">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
          </div>

          <div className="check-terms">
            <input
              type="checkbox"
              className="cbox"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)} // Toggle checkbox state
            />
            <div className="termsserv">
              By creating an account, I agree to our <span>Terms of use </span>
              and <span>Privacy Policy</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="error" style={{ color: "red" }}>
            {error}
          </p>
        )}
        {message && <p className="success">{message}</p>}

        <div className="submit-container">
          <button className="btn1" onClick={handleSignup}>
            SIGN UP
          </button>
          <div className="forgot-password">
            Already have an account?
            <Link to="/login">
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
