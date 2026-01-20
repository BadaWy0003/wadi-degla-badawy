import React, { useState } from "react";
import "./Signup.css";
import "../Contact/Contact.css";

import { Link } from "react-router-dom";
import apiClient from "../../util/client.js";
import { useNavigate } from "react-router-dom";
import wadi_degla_logo_login from '../../Public/Assets/Media/logo-color-stroke-notext.svg';
import { useGlobalState } from "../GlobalStateContext.js";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import ContactBubble from "../Contact/ContactBubble.js";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function Signup() {
  const { t } = useTranslation();
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const countryOptions = countryList().getData();
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
  const validatePhone = (phone) => /^\+?[1-9]\d{1,14}$/.test(phone);
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
        newError.fullName = t('signup.errorFullName');
      }

      if (!companyName) {
        newError.companyName = t('signup.errorCompanyName');
      }

      if (!email) {
        newError.email = t('signup.errorEmailRequired');
      } else if (!validateEmail(email)) {
        newError.email = t('signup.errorEmailInvalid');
      }

      if (!phone) {
        newError.phone = t('signup.errorPhoneRequired');
      } else if (!validatePhone(phone)) {
        newError.phone = t('signup.errorPhoneInvalid');
      }

      if (whatsapp && !validateWhatsapp(whatsapp)) {
        newError.whatsapp = t('signup.errorWhatsapp');
      }

      if (!password) {
        newError.password = t('signup.errorPasswordRequired');
      } else if (!validatePassword(password)) {
        newError.password = t('signup.errorPasswordInvalid');
      }
      if (!country) {
        newError.country = t('signup.errorCountry');
      }
      if (!port) {
        newError.port = t('signup.errorPort');
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

        alert(t('signup.successMessage'));
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
              t('signup.errorRegistration')
          );
        } else {
          console.error(error.message);
          alert(t('signup.errorNetwork'));
        }
      }
    };

    return (
      <>
      <Helmet>
            <title>{t('signup.pageTitle')}</title>
            <meta name="description" content={t('signup.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/signup" />
      </Helmet>
      
      <div className="container-big">
        <div className="container1">
          <div className="container1-title">
            <h1>{t('signup.title')}</h1>
            <h3>
              {t('signup.subtitle')}
            </h3>
          </div>
          <div className="container1-img">
            <img loading="lazy" src={wadi_degla_logo_login} alt={t('signup.logoAlt')} />
          </div>
        </div>
        <div className="container2">
          <div className="signup-form-title">
            <h1>{t('signup.signupTitle')}</h1>
            <p>{t('signup.formSubtitle')}</p>
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
                <label htmlFor="fullName">{t('signup.fullName')}</label>
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
                <label htmlFor="companyName">{t('signup.companyName')}</label>
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
                <label htmlFor="email">{t('signup.email')}</label>
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
                <label htmlFor="password">{t('signup.password')}</label>
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
                <label htmlFor="phone">{t('signup.phone')}</label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  placeholder={t('signup.phonePlaceholder')}
                  inputProps={{
                    name: "phone",
                  }}
                />
                {error.phone && <p className="error">{error.phone}</p>}
              </div>
              <div className="input-field country-phone">
                <label htmlFor="whatsapp">{t('signup.whatsapp')}</label>
                <PhoneInput
                  value={whatsapp}
                  onChange={setWhatsapp}
                  placeholder={t('signup.phonePlaceholder')}
                />
                {error.whatsapp && <p className="error">{error.whatsapp}</p>}
              </div>
            </div>
            <div className="double-inputs">
              <div className="input-field" id="input-country">
                <label htmlFor="country">{t('signup.country')}</label>
                <Select
                  options={countryOptions}
                  value={country}
                  onChange={setCountry}
                  classNamePrefix="react-select"
                  placeholder={t('signup.countryPlaceholder')}
                />
                {error.country && <p className="error">{error.country}</p>}
              </div>
              <div className="input-field">
                <label htmlFor="rnc">{t('signup.taxId')}</label>
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
                <label htmlFor="address">{t('signup.address')}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="input-field">
                <label htmlFor="port">{t('signup.port')}</label>
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

            <div className="submit">
              <button type="submit" className="btn1">
                {t('signup.signupButton')}
              </button>
              <div className="forgot-password">
                {t('signup.haveAccount')}{" "}
                <Link
                  to="/login"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span>{t('signup.loginLink')}</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
        <ContactBubble />

      </div>
      </>
    );
  } catch (err) {
    console.log(err);
    throw new Error("bayezz");
  }
}
