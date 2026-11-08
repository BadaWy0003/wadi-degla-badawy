'use client';
import React, { useState } from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';

export default function FaqHome() {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: t('home.faqQ1'),
            answer: t('home.faqA1')
        },
        {
            question: t('home.faqQ2'),
            answer: t('home.faqA2')
        },
        {
            question: t('home.faqQ3'),
            answer: t('home.faqA3')
        },
        {
            question: t('home.faqQ4'),
            answer: t('home.faqA4')
        },
        {
            question: t('home.faqQ5'),
            answer: t('home.faqA5')
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-home-section">
            <h2>{t('home.faqTitle')}</h2>
            <div className="faq-container">
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h3 
                            className="faq-question"
                            onClick={() => toggleAccordion(index)}
                        >
                            {faq.question}
                            <span className={`faq-toggle ${activeIndex === index ? 'active' : ''}`}>
                                ▼
                            </span>
                        </h3>
                        {/* Every answer is in the HTML (the page's FAQPage JSON-LD needs the
                            answers on the page); closed ones are hidden with CSS. */}
                        <p className={`faq-answer${activeIndex === index ? '' : ' faq-answer-closed'}`}>
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
