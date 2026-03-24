'use client';
import React, { useState, useEffect, useRef } from "react";
import "./ContactBubble.css";
import envelope from "../../Public/Assets/Icons/envelope.svg";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';

export default function ContactBubble() {
    const { t } = useTranslation();
    const [isClicked, setIsClicked] = useState(false);
    const bubbleRef = useRef(null);
    const router = useRouter();
  const lang = useLang();
    function OnClick(){
        router.push(`/${lang}/contact`);
        window.scrollTo({top: 0});
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bubbleRef.current && !bubbleRef.current.contains(event.target)) {
                setIsClicked(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className="contact-bubble-container" ref={bubbleRef}>
            <div 
                className={`contact-bubble ${isClicked ? 'active' : ''}`}
                onClick={() => setIsClicked(!isClicked)}
            >
                <img loading="lazy" src={envelope} alt={t('contactBubble.altText')} />
            </div>
            <div className={`contact-bubble-clicked ${isClicked ? 'active' : ''}`}>
                <p>{t('contactBubble.message')}</p>
                <button 
                className="btn1"
                onClick={OnClick}>{t('contactBubble.button')}</button>
            </div>
        </div>
    );
}