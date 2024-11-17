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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/customer/login",
        {
          email,
          password,
        }
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

        <img src={wadi_degla_logo_login} alt=''/></div>
        <div className='container2'>
            <div className='head'>
                <div className='text'>Login</div>
                <div className='underline'></div>
            </div>
            <form className='inputs'>

                <div className='input'>
                    <p>Email</p><input type='email' />
                </div>

                <div className='input'>
                    <div className='pass'><p>Password</p> <img src={password_eye_hidden_icon} alt=''/> </div>
                    <input type='password' />
                </div>

            </form>
            <div className='submit-container'>
                <input type="submit" value="LOGIN" className='btn1'/>
                <div className='forgot-password'>Don't have an account?
                    <Link to='/signup'><span>Register</span></Link>
                </div>
            </div>
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

        {error && <p className="error">{error}</p>}
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
