'use client';
import React, { useState } from "react";
import "./MyAccount.css";
import { useGlobalState } from "../GlobalStateContext.js";
import apiClient from "../../util/client.js";
import ContactBubble from "../Contact/ContactBubble.js";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';

export default function MyAccount() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("accountInformation");
  const { globalState, setGlobalState } = useGlobalState(); // to see if user is logged in
  const router = useRouter();
  const lang = useLang();

  const handleLogout = async () => {
    try {
      await apiClient.post(`/api/auth/logout`);
    } finally {
      setGlobalState({
        isLoggedIn: false,
        token: null,
        fullName: "",
        companyName: "",
        rnc: "",
        email: "",
        phone: "",
        whatsapp: "",
        country: "",
        countryCode: "",
        address: "",
        port: "",
      });

      router.push(`/${lang}/login`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      localStorage.removeItem("auth_token");
    }
  };

  // const responsive2 = {
  //     superLargeDesktop: {
  //       breakpoint: { max: 4000, min: 3000 },
  //       items: 6
  //     },
  //     desktop: {
  //       breakpoint: { max: 3000, min: 1024 },
  //       items: 6
  //     },
  //     tablet: {
  //       breakpoint: { max: 1024, min: 464 },
  //       items: 2
  //     },
  //     mobile: {
  //       breakpoint: { max: 464, min: 0 },
  //       items: 1.4
  //     }
  //   };

  return (
    <>
    
    <div className="account-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <a href="/">{t('myAccount.breadcrumbHome')}</a> &gt; <a href="/my account">{t('myAccount.breadcrumbCurrent')}</a> &gt;{" "}
        {selectedTab === 'accountInformation' ? t('myAccount.tabs.accountInformation') : t('myAccount.tabs.changePassword')}
      </div>
      <div className="my-account-container">
        <div className="my-account-container-left">
          <button
            className={`btn2 ${
              selectedTab === "accountInformation" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("accountInformation")}
          >
            {t('myAccount.tabs.accountInformation')}
          </button>

          <button
            className={`btn2 ${
              selectedTab === "changePassword" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("changePassword")}
          >
            {t('myAccount.tabs.changePassword')}
          </button>

          <button className="btn1" onClick={handleLogout}>
            {t('myAccount.buttons.logout')}
          </button>
        </div>

        <div className="my-account-container-right">
          {selectedTab === "accountInformation" ? (
            <div className="tabs-content">
              <div>
                {t('myAccount.fields.fullName')}: <p className="value"> {globalState.fullName}</p>
              </div>
              <div>
                {t('myAccount.fields.email')}: <p className="value">{globalState.email}</p>
              </div>
              <div>
                {t('myAccount.fields.phone')}: <p className="value">{globalState.phone}</p>
              </div>
              <div>
                {t('myAccount.fields.country')}: <p className="value">{globalState.country}</p>
              </div>
              <div>
                {t('myAccount.fields.company')}: <p className="value">{globalState.companyName}</p>
              </div>
              <div>
                {t('myAccount.fields.address')}: <p className="value">{globalState.address}</p>
              </div>
            </div>
          ) : (
            <div className="tabs-content">
              <button className="btn1" id="change-password">
                {t('myAccount.tabs.changePassword')}
              </button>
            </div>
          )}
        </div>
      </div>
      <ContactBubble />

    </div>
    </>
  );
}
