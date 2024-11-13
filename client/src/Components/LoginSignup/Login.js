import React from 'react'
import './Signup.css'

import { Link } from "react-router-dom";
//import email_icon from '../Assets/Icons/email-icon.svg'
import password_eye_hidden_icon from '../Assets/Icons/password-eye-hidden.svg'
//import google_icon from '../Assets/Icons/google-logo.svg'
//import apple_icon from '../Assets/Icons/apple-logo.svg'
//import facebook_icon from '../Assets/Icons/facebook-logo.svg'
//import wadi_degla_icon from '../Assets/Icons/wadi-degla-logo-icon.svg'
import wadi_degla_logo_login from '../Assets/wadi-degla-logo-login.svg'

export default function Login (){
    return (
       <div className='container-big'> 
       <div className='container1'>
        <h1>Wadi Degla</h1>
        <p>Join us by filling the following form</p>
        <img src={wadi_degla_logo_login} alt=''/></div>
        <div className='container2'>
            <div className='head'>
                <div className='text'>Login</div>
                <div className='underline'></div>
            </div>
            <form className='inputs'>

                <div className='input'>
                    <p>Email</p><input type='email' />
                </div>

                <div className='input'>
                    <div className='pass'><p>Password</p> <img src={password_eye_hidden_icon} alt=''/> </div>
                    <input type='password' />
                </div>

            </form>
            <div className='submit-container'>
                <input type="submit" value="LOGIN" className='btn1'/>
                <div className='forgot-password'>Don't have an account?
                    <Link to='/signup'><span>Register</span></Link>
                </div>
            </div>
        </div>
    </div> 
    )
}

