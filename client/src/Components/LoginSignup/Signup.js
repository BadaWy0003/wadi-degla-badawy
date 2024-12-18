import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import password_eye_hidden_icon from "../Assets/Icons/password-eye-hidden.svg";
import wadi_degla_logo_login from "../Assets/wadi-degla-logo-login.svg";
import { useGlobalState } from "../GlobalStateContext.js";
import PhoneInput from "react-phone-input-2"; // Import PhoneInput component
import Select from "react-select"; // Import react-select
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list"; // Optional helper for countries

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // const [agreeToTerms, setAgreeToTerms] = useState(false); // New state for terms checkbox
  const [error, setError] = useState({}); // Initialize error as an object
  const countryOptions = countryList().getData(); // Get country list
  const [whatsapp, setWhatsapp] = useState("");
  const [cname, setCname] = useState("");
  const [fname, setFname] = useState("");
  const [country, setCountry] = useState(null);
  const [address, setAddress] = useState("");
  const [rnc, setRnc] = useState("");

  const { globalState, setGlobalState } = useGlobalState(); // Access global state for user data
  const navigate = useNavigate();

  const validateUsername = (username) => /^[A-Za-z]{4,20}$/.test(username);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validateWhatsapp = (whatsapp) => /^\d{10}$/.test(whatsapp);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleSignup = async () => {
    const newError = {};

    if (!username) {
      newError.username = "Username is required.";
    } else if (!validateUsername(username)) {
      newError.username =
        "Username must be between 4 and 20 letters with no symbols.";
    }

    if (!email) {
      newError.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newError.email = "Please enter a valid email.";
    }

    if (!phone) {
      newError.phone = "Phone number is required.";
    } else if (!validatePhone(phone)) {
      newError.phone = "Phone number must be 10 digits.";
    }

     if (whatsapp && !validateWhatsapp(whatsapp)) {
      newError.whatsapp = "WhatsApp number must be 10 digits.";
    }

    if (!password) {
      newError.password = "Password is required.";
    } else if (!validatePassword(password)) {
      newError.password =
        "Password must be at least 8 characters, including an uppercase letter, lowercase letter, number, and a special character.";
    }

    // if (!agreeToTerms) {
    //   newError.terms = "You must agree to the terms and conditions.";
    // }

    setError(newError);
    if (Object.keys(newError).length > 0) {
      return; // Stop execution if there are validation errors
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

      if (response.status === 200 || response.status === 201) {
        alert("Registration successful! Please verify your email.");
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error);
        alert(
          error.response.data.error || "Registration failed. Please try again."
        );
      } else {
        console.error(error.message);
        alert("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="container-big">
      <div className="container1">
        <h1>Wadi Degla</h1>
        <p>Join us by filling the following form</p>
        <img src={wadi_degla_logo_login} alt="Wadi Degla Logo" />
      </div>
      <div className="container2">
        <div className="signup-form-title">
          <h1>Sign up</h1>
          <p>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum!</p>
          <div className="underline"></div>
        </div>
        <form
          className="signup-form"
          id="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className="double-inputs">
            <div className="input-field">
              <label htmlFor="fname">*Full Name</label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="cname">*Company/Project</label>
              <input
                type="text"
                id="cname"
                name="cname"
                value={cname}
                onChange={(e) => setCname(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="double-inputs">
            <div className="input-field">
              <label htmlFor="rnc">Tax ID/RNC</label>
              <input
                type="text"
                id="rnc"
                name="rnc"
                value={rnc}
                onChange={(e) => setRnc(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label htmlFor="email">*Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error.email && <p className="error">{error.email}</p>}
            </div>
          </div>
          <div className="double-inputs">
            <div className="input-field country-phone">
              <label htmlFor="phone">*Phone Number</label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                placeholder="Enter full number with country code"
                inputProps={{
                  name: "phone",
                  required: true,
                }}
              />
              {error.phone && <p className="error">{error.phone}</p>}
            </div>
            <div className="input-field country-phone">
              <label htmlFor="whatsapp">WhatsApp Number</label>
              <PhoneInput
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="Enter full number with country code"
              />
              {error.whatsapp && <p className="error">{error.whatsapp}</p>}
            </div>
          </div>
          <div className="double-inputs">
            <div className="input-field" id="input-country">
              <label htmlFor="country">*Country</label>
              <Select
                options={countryOptions}
                value={country}
                onChange={setCountry}
                classNamePrefix="react-select"
                placeholder="Search for a country"
                required
              />
            </div>
            <div className="input-field" id="input-address">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className='input-field'>                       
                              <label htmlFor="port">*Port of Destination</label>
                              <input
                                type="text"
                                id="port"
                                name="port"
                                required
                              />
                            </div>

          {/* <div className="input-field">
            <label>
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              I agree to the terms and conditions
            </label>
            {error.terms && <p className="error">{error.terms}</p>}
          </div> */}
          <button type="submit" className="btn1">
            Sign Up
          </button>
        </form>
        <div className="forgot-password">
          Already have an account?{" "}
          <Link to="/login">
            <span>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
