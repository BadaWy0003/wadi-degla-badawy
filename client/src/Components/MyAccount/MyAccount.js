import React, { useState } from "react";
import "./MyAccount.css";
import { useGlobalState } from "../GlobalStateContext.js";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {
  const [selectedTab, setSelectedTab] = useState("Account Information");
  const { globalState, setGlobalState } = useGlobalState(); // to see if user is logged in
  const navigate = useNavigate();

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

      navigate("/login");
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
    <div className="account-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <a href="/">Home</a> &gt; <a href="/my account">My Account</a> &gt;{" "}
        {selectedTab}
      </div>
      <div className="my-account-container">
        <div className="my-account-container-left">
          <button
            className={`btn2 ${
              selectedTab === "Account Information" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("Account Information")}
          >
            Account Information
          </button>

          <button
            className={`btn2 ${
              selectedTab === "Change Password" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("Change Password")}
          >
            Change Password
          </button>

          <button className="btn1" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="my-account-container-right">
          {selectedTab === "Account Information" ? (
            <div className="tabs-content">
              <div>
                Full Name: <p className="value"> {globalState.fullName}</p>
              </div>
              <div>
                Email: <p className="value">{globalState.email}</p>
              </div>
              <div>
                Phone: <p className="value">{globalState.phone}</p>
              </div>
              <div>
                Country: <p className="value">{globalState.country}</p>
              </div>
              <div>
                Company/Project Name:{" "}
                <p className="value">{globalState.companyName}</p>
              </div>
              <div>
                Address: <p className="value">{globalState.address}</p>
              </div>
            </div>
          ) : (
            <div className="tabs-content">
              <button className="btn1" id="change-password">
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
