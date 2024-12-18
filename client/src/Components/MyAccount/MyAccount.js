import React, { useState } from 'react';
import './MyAccount.css';
import { useGlobalState } from '../GlobalStateContext.js';
import { useNavigate } from 'react-router-dom';

import facebook_circle_white_icon from '../Assets/Icons/Social/facebook-circle-white-icon.svg'
import instagram_circle_white_icon from '../Assets/Icons/Social/instagram-circle-white-icon.svg'
import x_circle_white_icon from '../Assets/Icons/Social/x-circle-white-icon.svg'
import linkedin_circle_white_icon from '../Assets/Icons/Social/linkedin-circle-white-icon.svg'
import whatsapp_circle_white_icon from '../Assets/Icons/Social/whatsapp-circle-white-icon.svg'


export default function MyAccount(){
    const [selectedTab, setSelectedTab] = useState('Account Information');
    const { globalState, setGlobalState } = useGlobalState(); // to see if user is logged in
    const navigate = useNavigate();


    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem("userData");
      
        // Reset global state
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
        window.scrollTo({top: 0, behavior: 'smooth'})
      };
      
    
    const responsive2 = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 6
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 6
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1.4
        }
      };

    return(
        <div className='account-container'>
                
            {/* Breadcrumb Navigation */}
            <div className="breadcrumb">
                <a href="/">Home</a> &gt; <a href="/my account">My Account</a> &gt; {selectedTab}
            </div>
                <div className="my-account-container">

                    <div className="my-account-container-left">

                            <button 
                            className={`btn2 ${selectedTab === 'Account Information' ? 'active' : ''}`} 
                            onClick={() => setSelectedTab('Account Information')}>
                                Account Information
                                </button>

                            <button 
                            className={`btn2 ${selectedTab === 'Change Password' ? 'active' : ''}`} 
                            onClick={() => setSelectedTab('Change Password')}>
                                Change Password
                                </button>

                            <button 
                            className='btn1' 
                            onClick={handleLogout}>Logout
                             </button>
                    </div>

                    <div className="my-account-container-right">
                        {selectedTab == 'Account Information' ? (
                            <div className='tabs-content'>
                                    <p>Full Name: <p className='value'> {globalState.fullName}</p></p>
                                    <p>Email: <p className='value'>{globalState.email}</p></p>
                                    <p>Phone: <p className='value'>{globalState.phone}</p></p>
                                    <p>Country: <p className='value'>{globalState.country}</p></p>
                                    <p>Company/Project Name: <p className='value'>{globalState.companyName}</p></p>
                                    <p>Address: <p className='value'>{globalState.address}</p></p>

                                </div>
                            
                        ) : (  
                            <div className='tabs-content'>
                                <button className='btn1' id='change-password'>Change Password</button>
                            </div>
                        )}
                    </div>    
                </div>       
                
            </div>    
            )
}