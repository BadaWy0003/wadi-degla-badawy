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

    const account_data = {
        full_name: 'example name',
        email: 'example@example.com',
        phone: '0123456789',
        company: 'example corp',
        tax_id: '',
        whatsapp: '',
        country: 'Nigeria',
    }
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
        <div className='contact-container'>
                

                <div className="my-account-container">

                    <div className="my-account-container-left">
                            <button className="btn2" onClick={() => setSelectedTab('Account Information')}>Account Information</button>
                            <button className="btn2" onClick={() => setSelectedTab('Change Password')}>Change Password</button>
                            <button className='btn1' onClick={() => { setGlobalState({
                                ...globalState,
                                isLoggedIn: false,
                            }); navigate('/'); // Redirect to the homepage
                                window.scrollTo({top: 0, behavior: 'smooth'})
                             }}>Logout</button>
                    </div>

                    <div className="my-account-container-right">
                        {selectedTab == 'Account Information' ? (
                            <div className='tabs-content'>{Object.entries(globalState)
                                .filter(([key, value]) => value) // Filter out properties with empty values
                                .map(([key, value]) => (
                                    <p key={key}>
                                        {`${key.replace('_', ' ')}: ${value}`}
                                    </p>
                                ))}</div>
                            
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