import React, { useEffect, useState } from 'react';
import './Contact.css';
import '../LoginSignup/Signup.css'
import 'react-multi-carousel/lib/styles.css';
import Select from 'react-select';
import { useGlobalState } from '../GlobalStateContext.js';

import facebook_circle_white_icon from '../Assets/Icons/Social/facebook-circle-white-icon.svg'
import instagram_circle_white_icon from '../Assets/Icons/Social/instagram-circle-white-icon.svg'
import x_circle_white_icon from '../Assets/Icons/Social/x-circle-white-icon.svg'
import linkedin_circle_white_icon from '../Assets/Icons/Social/linkedin-circle-white-icon.svg'
import whatsapp_circle_white_icon from '../Assets/Icons/Social/whatsapp-circle-white-icon.svg'



export default function Contact2(){
    const [countryOptions, setCountryOptions] = useState([]);
    const [countryCodeOptions, setCountryCodeOptions] = useState([]);
    const { globalState, setGlobalState } = useGlobalState(); // Access global state for user data
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [errors, setErrors] = useState({});


    const [formData, setFormData] = useState({
      fname: '',
      cname: '',
      rnc: '',
      email: '',
      phone: '',
      whatsapp: '',
      country: null,
      countryCode: null,
      address: '',
      port: '',
      message: '',
    });
  
  

    // Fetch country and country code data _____________________________________________________________________________________________________
    // useEffect(() => {
    //   fetch('https://restcountries.com/v3.1/all')
    //     .then((response) => response.json())
    //     .then((data) => {
    //       const formattedCountries = data.map((country) => ({
    //         label: country.name.common,
    //         value: country.name.common,
    //       }));

    //       const formattedCodes = data
    //         .filter((country) => country.idd?.root)
    //         .map((country) => ({
    //           label: `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''} (${country.name.common})`,
    //           value: `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}`,
    //         }));

    //       setCountryOptions(formattedCountries);
    //       setCountryCodeOptions(formattedCodes);
    //     })
    //     .catch((error) => console.error('Error fetching country data:', error));
    // }, []);


    
      // Pre-fill form for logged-in users _____________________________________________________________________________________________________
useEffect(() => {
  if (globalState.isLoggedIn) {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        fname: globalState?.fname || '',
        cname: globalState?.cname || '',
        rnc: globalState?.rnc || '',
        port: globalState?.port || '',
        email: globalState?.email || '',
        phone: globalState?.phone || '',
        whatsapp: globalState?.whatsapp || '',
        country: globalState?.country || null,
        countryCode: globalState?.countryCode || null,
        address: globalState?.address || '',
      };
      console.log("Form data pre-filled from globalState:", updatedData);
      return updatedData;
    });
  }
}, [globalState]);


    //Validation for phone number _____________________________________________________________________________________________________
    const validateFields = () => {
      const newErrors = {};
      const phoneRegex = /^\d{8,15}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Phone number must be numeric and between 8 to 15 digits.';
      }
  
      if (formData.whatsapp && !phoneRegex.test(formData.whatsapp)) {
        newErrors.whatsapp = 'Phone number must be numeric and between 8 to 15 digits.';
      }
      
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email.';
      }

      return newErrors;
    };


  // Handle input change _____________________________________________________________________________________________________
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle country selection _____________________________________________________________________________________________________
  // const handleCountryChange = (selectedOption) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     country: selectedOption,
  //   }));
  // };
 
  // Handle country code selection _____________________________________________________________________________________________________
  // const handleCountryCodeChange = (selectedOption) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     countryCode: selectedOption?.value || null,
  //   }));
  // };

//_____________________________________________________________________________________________________

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // Clear errors if validation passes
    console.log('Form Data Submitted:', formData);

    // Simulate API submission
    setTimeout(() => {
      setShowSuccessPopup(true);

      // Clear the form after submission
      setFormData({
        fname: '',
        cname: '',
        rnc: '',
        email: '',
        phone: '',
        whatsapp: '',
        country: null,
        countryCode: null,
        address: '',
        port: '',
        message: '',
      });
    }, 500); // Simulate a delay for feedback
  };
//_____________________________________________________________________________________________________
      

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

//_____________________________________________________________________________________________________

    const customStyles = {
      container: (provided) => ({
        ...provided,
        width: '100%',
        maxWidth: '250px', // Set a fixed max width for the container
      }),
      control: (provided) => ({
        ...provided,
        backgroundColor: '#f5f5f5',
        borderColor: '#ad9571',
        padding: '0',
        fontSize: '12px',
        borderRadius: '4px',
        boxShadow: 'none',
        height: '3rem',
        width: '100%', // Force control width to fit the parent width
        maxWidth: '250px', // Set a fixed max width for the dropdown
        overflow: 'hidden', // Prevent expanding
        textOverflow: 'ellipsis', // Ellipsis for overflowed text
        display: 'flex',
        alignItems: 'center',
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: '0 8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }),
      singleValue: (provided) => ({
        ...provided,
        color: '#333',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 'calc(100% - 30px)', // Adjust for the dropdown indicator
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: '#ad9571',
      }),
      indicatorSeparator: () => ({
        display: 'none', // Hide separator
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '250px',
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#6a7b83' : state.isFocused ? '#ad9571' : '#fff',
        color: state.isSelected ? '#fff' : '#333',
        padding: '8px',
        fontSize: '14px',
      }),
    };

    
      //_____________________________________________________________________________________________________
      // return(<h1>Contact2</h1>)
    return(
        <div className='contact-container'>
                <div className="gallery-hero">
                        <div className="gallery-hero-bg"></div>
                            <h1>CONTACT US</h1>
                    </div>
                    <div className="contact-inner">

                        <div className="contact-inner-left">
                        {showSuccessPopup && (
                  <div className="success-popup">
                    <p>Message sent successfully!</p>
                    <button onClick={() => setShowSuccessPopup(false)} className='btn1'>Close</button>
                  </div>
                )}
                            <h1>Send us a message</h1>
                            <p>Our team will get back to you as soon as possible!</p>

                        <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
                        {globalState.isLoggedIn == false ? (
                            <>
                            <div className='input-field'>
                              <label htmlFor="fname">*Full Name</label>
                              <input
                                type="text"
                                id="fname"
                                name="fname"
                                value={formData.fname}
                                onChange={handleInputChange}
                                required
                              />
                          </div>
                        <div className='double-input-fields'>
                          <div className='input-field'>
                              <label htmlFor="cname">*Company/Project</label>
                              <input
                                type="text"
                                id="cname"
                                name="cname"
                                value={formData.cname}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className='input-field'>
                              <label htmlFor="rnc">Tax ID/RNC</label>
                              <input
                                type="text"
                                id="rnc"
                                name="rnc"
                                value={formData.rnc}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                            <div className='input-field'>
                              <label htmlFor="email">*Email Address</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.email && <p className="error">{errors.email}</p>}
                            </div>

                            <div className='input-field country-phone'>
                              <label htmlFor="phone">*Phone Number</label>
                              {/* <Select
                                id="country-code"
                                options={countryCodeOptions}
                                value={countryCodeOptions.find(
                                  (option) => option.value === formData.countryCode
                                )}
                                onChange={handleCountryCodeChange}
                                placeholder="Search country code"
                                styles={customStyles}
                                isSearchable
                                required
                              /> */}

                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.phone && <p className="error">{errors.phone}</p>}
                            </div>

                            <div className='input-field country-phone'>
                              <label htmlFor="whatsapp">WhatsApp Number</label>
                              {/* <Select
                                id="country-code"
                                options={countryCodeOptions}
                                value={countryCodeOptions.find(
                                  (option) => option.value === formData.countryCode
                                )}
                                onChange={handleCountryCodeChange}
                                placeholder="Search country code"
                                styles={customStyles}
                                isSearchable
                                required
                              /> */}
                              <input
                                type="tel"
                                id="whatsapp"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleInputChange}
                              />
                              {errors.whatsapp && <p className="error">{errors.whatsapp}</p>}
                            </div>

                          <div className='country-address'>
                            <div className='input-field' id='input-country'>
                              <label htmlFor="country">*Country</label>
                              {/* <Select
                                id="country"
                                options={countryOptions}
                                value={formData.country}
                                onChange={handleCountryChange}
                                styles={customStyles}
                                isSearchable
                                required
                              /> */}
                            </div>

                            <div className='input-field' id='input-address'>
                              <label htmlFor="address">Address</label>
                              <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                            <div className='input-field'>                       
                              <label htmlFor="port">*Port of Destination</label>
                              <input
                                type="text"
                                id="port"
                                name="port"
                                value={formData.port}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            
                            </>
                        ): (<>Since you are signed in, we will get the rest of your info from your account<br/></> )}
                        <div className='input-field-message'>
                          <label htmlFor="message">*Message</label>
                              <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                              />  
                            </div>
                                                                
                            <button type="submit" className='btn1'> SEND </button>
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