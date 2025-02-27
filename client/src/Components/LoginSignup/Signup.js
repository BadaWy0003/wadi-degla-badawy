import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import apiClient from "../../util/client.js";
import { useNavigate } from "react-router-dom";
// import password_eye_hidden_icon from "../../Public/Assets/Icons/password-eye-hidden.svg";
import wadi_degla_logo_login from "../../Public/Assets/Logo-Identity/wadi-degla-logo-login.svg";
import { useGlobalState } from "../GlobalStateContext.js";
import PhoneInput from "react-phone-input-2"; // Import PhoneInput component
import Select from "react-select"; // Import react-select
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list"; // Optional helper for countries
import ContactBubble from "../Contact/ContactBubble.js";

export default function Signup() {
  // const [username, setUsername] = useState("");
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // const [agreeToTerms, setAgreeToTerms] = useState(false); // New state for terms checkbox
  const [error, setError] = useState({}); // Initialize error as an object
  const countryOptions = countryList().getData(); // Get country list
  const [whatsapp, setWhatsapp] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [country, setCountry] = useState(null);
  const [address, setAddress] = useState("");
  const [rnc, setRnc] = useState("");
  const [port, setPort] = useState("");

  const { globalState, setGlobalState } = useGlobalState(); // Access global state for user data
  const navigate = useNavigate();

  // const validateUsername = (username) => /^[A-Za-z]{4,20}$/.test(username);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validateWhatsapp = (whatsapp) => /^\d{10}$/.test(whatsapp);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  try {
    const handleSignup = async () => {
      const newError = {};
      // if (!username) {
      //   newError.username = "Username is required.";
      // } else if (!validateUsername(username)) {
      //   newError.username =
      //     "Username must be between 4 and 20 letters with no symbols.";
      // }

      if (!fullName) {
        newError.fullName = "Please enter your full name.";
      }

      if (!companyName) {
        newError.companyName = "The company/project name is required";
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
      if (!country) {
        newError.country = "Please select a country.";
      }
      if (!port) {
        newError.port =
          "Please enter the port of destination in case of shipment, if not please enter 'N/A'";
      }
      // if (!agreeToTerms) {
      //   newError.terms = "You must agree to the terms and conditions.";
      // }

      setError(newError);
      if (Object.keys(newError).length > 0) {
        return; // Stop execution if there are validation errors
      }

      try {
        const { data } = await apiClient.post(`/api/auth/customer/register`, {
          fullName,
          companyName,
          rnc,
          email,
          phone,
          whatsapp,
          country: country.label,
          address,
          port,
          password,
        });

        alert("Registration successful! Please verify your email.");
        const userData = {
          token: data.token,
          fullName: data.fullName,
          companyName: data.companyName,
          rnc: data.rnc,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          country: data.country,
          countryCode: data.countryCode,
          address: data.address,
          port: data.port,
        };

        // Save user data to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("auth_token", JSON.stringify(data.token));

        // Update global state
        setGlobalState({
          ...globalState,
          isLoggedIn: true,
          ...userData,
        });

        // Navigate to the home page
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        if (error.response) {
          console.error(error.response.data.error);
          alert(
            error.response.data.error ||
              "Registration failed. Please try again."
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
          <div className="container1-title">
            <h1>Wadi Degla</h1>
            <h3>
              Welcome to Wadi Degla! Feel free to create an account it only
              takes a couple of minutes.
            </h3>
          </div>
          <div className="container1-img">
            <img src={wadi_degla_logo_login} alt="Wadi Degla Logo" />
          </div>
        </div>
        <div className="container2">
          <div className="signup-form-title">
            <h1>Sign up</h1>
            <p>Join us by filling the following form!</p>
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
                <label htmlFor="fullName">*Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setfullName(e.target.value)}
                />
                {error.fullName && <p className="error">{error.fullName}</p>}
              </div>
              <div className="input-field">
                <label htmlFor="companyName">*Company/Project Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyName}
                  onChange={(e) => setcompanyName(e.target.value)}
                />
                {error.companyName && (
                  <p className="error">{error.companyName}</p>
                )}
              </div>
            </div>
            <div className="double-inputs">
              <div className="input-field">
                <label htmlFor="email">*Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error.email && <p className="error">{error.email}</p>}
              </div>
              <div className="input-field">
                <label htmlFor="password">*Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error.password && <p className="error">{error.password}</p>}
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
                />
                {error.country && <p className="error">{error.country}</p>}
              </div>
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
            </div>

            <div className="double-inputs">
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

              <div className="input-field">
                <label htmlFor="port">*Port of Destination</label>
                <input
                  type="text"
                  id="port"
                  name="port"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
                {error.port && <p className="error">{error.port}</p>}
              </div>
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
            <div className="submit">
              <button type="submit" className="btn1">
                Sign Up
              </button>
              <div className="forgot-password">
                Already have an account?{" "}
                <Link
                  to="/login"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span>Login</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
        <ContactBubble />

      </div>
    );
  } catch (err) {
    console.log(err);
    throw new Error("bayezz");
  }
}
