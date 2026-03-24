'use client';
import React, {useState} from "react";
import { useTranslation } from 'react-i18next';
import './Patterns.css';
import ContactBubble from "../Contact/ContactBubble";

import p1 from '../../Public/Assets/Media/Patterns/p1.webp'
import p2 from '../../Public/Assets/Media/Patterns/p2.webp'
import p3 from '../../Public/Assets/Media/Patterns/p3.webp'
import p4 from '../../Public/Assets/Media/Patterns/p4.webp'
import pavers1 from '../../Public/Assets/Media/Patterns/pavers1.webp'
import pavers2 from '../../Public/Assets/Media/Patterns/pavers2.webp'
import pavers3 from '../../Public/Assets/Media/Patterns/pavers3.webp'
import pavers4 from '../../Public/Assets/Media/Patterns/pavers4.webp'
import s1 from '../../Public/Assets/Media/Patterns/1.webp'
import s2 from '../../Public/Assets/Media/Patterns/2.webp'
import s3 from '../../Public/Assets/Media/Patterns/3.webp'
import s4 from '../../Public/Assets/Media/Patterns/4.webp'
import s5 from '../../Public/Assets/Media/Patterns/5.webp'
import s6 from '../../Public/Assets/Media/Patterns/6.webp'
import s7 from '../../Public/Assets/Media/Patterns/7.webp'
import s8 from '../../Public/Assets/Media/Patterns/8.webp'
import s9 from '../../Public/Assets/Media/Patterns/9.webp'
import s10 from '../../Public/Assets/Media/Patterns/10.webp'
import split_face_1 from '../../Public/Assets/Media/Patterns/split-face-1.webp'
import split_face_2 from '../../Public/Assets/Media/Patterns/split-face-2.webp'
import split_face_3 from '../../Public/Assets/Media/Patterns/split-face-3.webp'
import split_face_4 from '../../Public/Assets/Media/Patterns/split-face-4.webp'
import split_face_5 from '../../Public/Assets/Media/Patterns/split-face-5.webp'
import split_face_6 from '../../Public/Assets/Media/Patterns/split-face-6.webp'
import split_face_7 from '../../Public/Assets/Media/Patterns/split-face-7.webp'
import split_face_8 from '../../Public/Assets/Media/Patterns/split-face-8.webp'
import split_face_9 from '../../Public/Assets/Media/Patterns/split-face-9.webp'
import split_face_10 from '../../Public/Assets/Media/Patterns/split-face-10.webp'

import pattern1 from '../../Public/Assets/Media/Patterns/pattern1.webp'
import pattern2 from '../../Public/Assets/Media/Patterns/pattern2.webp'
import pattern3 from '../../Public/Assets/Media/Patterns/pattern3.webp'
import pattern4 from '../../Public/Assets/Media/Patterns/pattern4.webp'

import Section from "../Section/Section";


export default function Patterns(){
    const { t } = useTranslation();
const [paver, setPaver] = useState(pavers1);
const [splitFace, setSplitFace] = useState(split_face_1);

const patternImages=[
    pattern1,
    pattern2,
    pattern3,
    pattern4,
]

    
    
    return(
        <>
        <Helmet>
            <title>{t('patterns.pageTitle')}</title>
            <meta name="description" content={t('patterns.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/patterns" />
        </Helmet>

        <div className='patterns-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                    <h1>{t('patterns.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                    <p>{'>'} {t('patterns.breadcrumbCurrent')}</p>
                        </div>
                </div>  
            <div className="pattern-section">
                <div className="pattern-section-left">
                    <h2>{t('patterns.paversTitle')}</h2>
                    <p>{t('patterns.selectMaterial')}</p>
                    <div className="pattern-section-left-materials">
                        <img loading="lazy" onClick={()=>setPaver(pavers1)} src={p1} alt={t('patterns.paversAlt', { number: 1 })}/>
                        <img loading="lazy" onClick={()=>setPaver(pavers2)} src={p2} alt={t('patterns.paversAlt', { number: 2 })}/>
                        <img loading="lazy" onClick={()=>setPaver(pavers3)} src={p3} alt={t('patterns.paversAlt', { number: 3 })}/>
                        <img loading="lazy" onClick={()=>setPaver(pavers4)} src={p4} alt={t('patterns.paversAlt', { number: 4 })}/>
                    </div>
                </div>
                <div className="pattern-section-right">
                    <img loading="lazy" src={paver} alt={t('patterns.paversMainAlt')}/>
                    </div>
    
            </div>

            <div id='pattern-section-splitface' className="pattern-section">
                <div className="pattern-section-left">
                    <h2>{t('patterns.splitFaceTitle')}</h2>
                    <p>{t('patterns.selectMaterial')}</p>
                    <div id="pattern-section-left-materials-splitface" className="pattern-section-left-materials">
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_1)} src={s1} alt={t('patterns.splitFaceAlt', { number: 1 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_2)} src={s2} alt={t('patterns.splitFaceAlt', { number: 2 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_3)} src={s3} alt={t('patterns.splitFaceAlt', { number: 3 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_4)} src={s4} alt={t('patterns.splitFaceAlt', { number: 4 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_5)} src={s5} alt={t('patterns.splitFaceAlt', { number: 5 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_6)} src={s6} alt={t('patterns.splitFaceAlt', { number: 6 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_7)} src={s7} alt={t('patterns.splitFaceAlt', { number: 7 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_8)} src={s8} alt={t('patterns.splitFaceAlt', { number: 8 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_9)} src={s9} alt={t('patterns.splitFaceAlt', { number: 9 })}/>
                        <img loading="lazy" onClick={()=>setSplitFace(split_face_10)} src={s10} alt={t('patterns.splitFaceAlt', { number: 10 })}/>

                    </div>
                </div>
                <div className="pattern-section-right">
                    <img loading="lazy" src={splitFace} alt={t('patterns.splitFaceMainAlt')}/>
                    </div>
    
            </div>
            <div className="pattern-section">

        <Section 
            title={t('patterns.patternsTitle')} 
                    text={""}
                            images={patternImages} 
                    imagePosition="right" 

                />
            </div>


            <ContactBubble />
            </div>    
            </>
            )
}