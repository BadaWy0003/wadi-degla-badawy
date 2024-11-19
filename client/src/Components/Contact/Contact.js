import React, { useEffect, useState } from 'react';
import './Contact.css';
import bullseye_gold from '../Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../Assets/Icons/paper-plane-gold.svg'
import company_logo from '../Assets/Icons/partners/company-logo.png'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Select from 'react-select';
import { useGlobalState } from '../GlobalStateContext.js';

import facebook_circle_white_icon from '../Assets/Icons/Social/facebook-circle-white-icon.svg'
import instagram_circle_white_icon from '../Assets/Icons/Social/instagram-circle-white-icon.svg'
import x_circle_white_icon from '../Assets/Icons/Social/x-circle-white-icon.svg'
import linkedin_circle_white_icon from '../Assets/Icons/Social/linkedin-circle-white-icon.svg'
import whatsapp_circle_white_icon from '../Assets/Icons/Social/whatsapp-circle-white-icon.svg'



export default function Contact(){
    const [countries, setCountries] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCode, setSelectedCode] = useState(null);
    const { globalState, setGlobalState } = useGlobalState(); // to see if user is logged in


    useEffect(() => {
        // Fetch country data
        fetch('https://restcountries.com/v3.1/all')
          .then((response) => response.json())
          .then((data) => {
            const formattedCountries = data.map((country) => ({
              label: country.name.common,
              value: country.name.common,
              code: country.idd?.root
                ? `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}`
                : null,
            }));
    
            setCountryOptions(formattedCountries);
          })
          .catch((error) => console.error('Error fetching country data:', error));
      }, []);
    
      const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setSelectedCode(selectedOption.code);
      };
    
      const handleCodeChange = (selectedOption) => {
        setSelectedCode(selectedOption.value);
        setSelectedCountry(countryOptions.find((country) => country.code === selectedOption.value));
      };
    
      const codeOptions = countryOptions
        .filter((country) => country.code)
        .map((country) => ({
          label: `${country.code} (${country.label})`,
          value: country.code,
        }));
      

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


      const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: '#f5f5f5', // Light background color
          borderColor: '#ccc', // Border color
          padding: '10px',
          fontSize: '14px',
          borderRadius: '4px',
          boxShadow: 'none',
          minHeight: '40px',
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: '#fff', // Menu background color
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Drop shadow for menu
          
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#e6e6e6' : '#fff', // Highlight on focus or selection
          color: state.isSelected ? '#fff' : '#333', // Text color
          padding: '10px',
          fontSize: '14px',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#333', // Text color for the selected item
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: '#007bff', // Dropdown indicator color
        }),
        indicatorSeparator: () => ({
          display: 'none', // Remove the separator between indicator and select box
        }),
      };
    
    return(
        <div className='contact-container'>
                <div className="gallery-hero">
                        <div className="gallery-hero-bg"></div>
                            <h1>CONTACT US</h1>
                    </div>
                    <div className="contact-inner">

                        <div className="contact-inner-left">
                            <h1>Send us a message</h1>
                            <p>Our team will get back to you as soon as possible!</p>

                        <form className="contact-form" id="contact-form">
                        {globalState.isLoggedIn == false ? (
                            <>
                            <label for="fname">*Full name</label> <br/>
                            <input type="text" id="fname" name="fname" placeholder="Enter your full name" required/> <br/>

                            <label for="cname">Company/Project name</label> <br/>
                            <input type="text" id="cname" name="cname" placeholder="Enter your company/project name"/> <br/>
                            <label for="rnc">Tax ID/RNC</label> <br/>
                            <input type="text" id="rnc" name="rnc" placeholder="Enter tax id/rnc"/> <br/>

                            <label for="email">*Email address</label> <br/>
                            <input type="email" id="email" name="email" placeholder="Enter your email address" required/> <br/>

                            {/* Searchable Country Code Selector */}
                            <div>
                                <label htmlFor="country-code">Search Country Code:</label>
                                <Select
                                id="country-code"
                                options={countryOptions}
                                onChange={handleCountryChange}
                                value={codeOptions.find((option) => option.value === selectedCode)}

                                placeholder="Search country or code"
                                styles={customStyles} // Apply custom styles to country select
                                isSearchable
                                />
                            </div>

                            {/* Phone Number Input */}
                            <label htmlFor="phone">Phone Number:</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '10px' }}>{selectedCode || '+___'}</span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="Enter phone number"
                                    />
                                    </div>  <br/>  

                                    <label htmlFor="whatsapp">Whatsapp number:</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '10px' }}>{selectedCode || '+___'}</span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="Enter phone number"
                                    />
                                    </div>  <br/>  

                            <label htmlFor="country">Select Country:</label>
                                <Select
                                id="country"
                                options={countryOptions}
                                placeholder="Search for a country"

                                styles={customStyles} // Apply custom styles to country select
                                isSearchable
                                /> <br/>

                            <label for="address">Address</label> <br/>
                            <input type="text" id="address" name="address" placeholder="Enter your address"/> <br/>    
                            </>
                        ): (<>Since you are signed in, we will get the rest of your info from your account<br/></> )}
                            

                            <label for="port">*Port of destination</label> <br/>
                            <input type="text" id="port" name="port" placeholder="Enter port of destination" required /> <br/>

                          

                            <label for="message">Message</label> <br/>
                            <textarea name="message" form="contact-form" placeholder="Enter your message here..."/> <br/>
                                    
                            <input type="submit" value="SEND" className='btn1'/>
                        </form>
                        </div>

                        <div className="contact-inner-right">
                            <h1>Contact information</h1>

                            <div className="contact-info">

                                <div className="phone-numbers">
                                    <h4>Phone</h4>
                                    <a href= "tel:+201067260314"> (+20) 10-6726-0314 </a>
                                    <a href= "tel:+201155559896"> (+20) 11-5555-9896 </a>
                                    <a href= "tel:+201016667890"> (+20) 101-666-7890 </a>
                                </div>

                                <div className="email-address">
                                    <h4>Email</h4>
                                    <a href= "mailto: info@wadidegla-eg.com"> info@wadidegla-eg.com </a>
                                </div>

                                <div className="location">
                                    <h4>Address</h4>
                                    <a href='https://maps.app.goo.gl/bM4qT3UBLVt3r7tN7' target="_blank"> 
                                        36, 25A Shaq Althoaban Industrial 
                                        Area for Marble & Granite, Tourrah, 
                                        Cairo, Egypt 
                                    </a>
                                </div>
                                <div className="social">
                                    <h4>Social</h4>
                                    <div className='social-icons'>
                                        <a href='https://www.facebook.com/wadideglaco' target="_blank"><img src={facebook_circle_white_icon} className='social-icons-footer'/></a>
                                        <a href='https://instagram.com/wadideglaco' target="_blank"><img src={instagram_circle_white_icon} className='social-icons-footer'/></a>
                                        <a href='https://twitter.com/wadideglaaco' target="_blank"><img src={x_circle_white_icon} className='social-icons-footer'/></a>
                                        <a href='https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/' target="_blank"><img src={linkedin_circle_white_icon} className='social-icons-footer'/></a>
                                        <a href='https://wa.me/message/LAQ57AMNJ5ZON1?src=qr' target="_blank"><img src={whatsapp_circle_white_icon} className='social-icons-footer'/></a>

                                    </div>
                                </div>
                            </div>

                        </div>

            </div>                 
                
            </div>    
            )
}