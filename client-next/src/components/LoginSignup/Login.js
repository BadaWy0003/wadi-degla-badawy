'use client';
import React, { useState } from "react";
import "./Signup.css";
import "../Contact/Contact.css";
import { useGlobalState } from "../GlobalStateContext.js";
import wadi_degla_logo_login from '../../Public/Assets/Media/logo-color-stroke-notext.svg';
import apiClient from "../../util/client.js";
import ContactBubble from "../Contact/ContactBubble.js";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import LangLink from '../LangLink';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // State to hold field-specific errors
  const [message, setMessage] = useState("");
  const router = useRouter();
  const lang = useLang();
  const { setGlobalState } = useGlobalState(); // Access global state for user data

  // Email validation regex
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password validation (at least 8 characters, one letter, one number)
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleLogin = async () => {
    let validationErrors = {};
    // Validate inputs
    if (!validateEmail(email)) {
      validationErrors.email = t('login.errorEmail');
    }

    if (!validatePassword(password)) {
      validationErrors.password = t('login.errorPassword');
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
      const { data } = await apiClient.post(`/api/auth/customer/login`, {
        email,
        password,
      });

      // Update global state with user data
      setGlobalState({
        isLoggedIn: true,
        ...data, // Spread all fields from response.data
      });
      localStorage.setItem("auth_token", data.token);

      setMessage("Login successful!");
      router.push(`/${lang}/`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message || "Login failed. Please try again.",
      });
      setMessage("");
    }
  };

  return (
    <>
    <Helmet>
            <title>{t('login.pageTitle')}</title>
            <meta name="description" content={t('login.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/login" />
    </Helmet>
    
    <div className="container-big">
      <div className="container1">
        <div className="container1-title">
          <h1>{t('login.title')}</h1>
          <h3>
            {t('login.subtitle')}
          </h3>
        </div>
        <div className="container1-img">
          <img loading="lazy" src={wadi_degla_logo_login} alt={t('login.logoAlt')} />
        </div>
      </div>
      <div className="container2" id="container2-login">
        <div className="signup-form-title">
          <h1>{t('login.loginTitle')}</h1>
          <p>{t('login.welcomeBack')}</p>
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
            <label htmlFor="email">{t('login.emailAddress')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-field">
            <label htmlFor="password">{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {errors.general && (
            <p className="error" style={{ color: "red" }}>
              {t('login.errorGeneral')}
            </p>
          )}
          {message && <p className="success">{t('login.loginSuccess')}</p>}

          <div className="submit">
            <button className="btn1">{t('login.loginButton')}</button>
            <div className="forgot-password">
              {t('login.noAccount')}
              <LangLink
                href="/signup"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span>{t('login.register')}</span>
              </LangLink>
            </div>
          </div>
        </form>
      </div>
      <ContactBubble />
    </div>
    </>
  );
}
