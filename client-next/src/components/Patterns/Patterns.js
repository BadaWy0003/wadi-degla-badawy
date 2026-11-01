'use client';
import React, {useState} from "react";
import { useTranslation } from 'react-i18next';
import './Patterns.css';
import ContactBubble from "../Contact/ContactBubble";

const p1 = '/Assets/Media/Patterns/p1.webp'
const p2 = '/Assets/Media/Patterns/p2.webp'
const p3 = '/Assets/Media/Patterns/p3.webp'
const p4 = '/Assets/Media/Patterns/p4.webp'
const pavers1 = '/Assets/Media/Patterns/pavers1.webp'
const pavers2 = '/Assets/Media/Patterns/pavers2.webp'
const pavers3 = '/Assets/Media/Patterns/pavers3.webp'
const pavers4 = '/Assets/Media/Patterns/pavers4.webp'
const s1 = '/Assets/Media/Patterns/1.webp'
const s2 = '/Assets/Media/Patterns/2.webp'
const s3 = '/Assets/Media/Patterns/3.webp'
const s4 = '/Assets/Media/Patterns/4.webp'
const s5 = '/Assets/Media/Patterns/5.webp'
const s6 = '/Assets/Media/Patterns/6.webp'
const s7 = '/Assets/Media/Patterns/7.webp'
const s8 = '/Assets/Media/Patterns/8.webp'
const s9 = '/Assets/Media/Patterns/9.webp'
const s10 = '/Assets/Media/Patterns/10.webp'
const split_face_1 = '/Assets/Media/Patterns/split-face-1.webp'
const split_face_2 = '/Assets/Media/Patterns/split-face-2.webp'
const split_face_3 = '/Assets/Media/Patterns/split-face-3.webp'
const split_face_4 = '/Assets/Media/Patterns/split-face-4.webp'
const split_face_5 = '/Assets/Media/Patterns/split-face-5.webp'
const split_face_6 = '/Assets/Media/Patterns/split-face-6.webp'
const split_face_7 = '/Assets/Media/Patterns/split-face-7.webp'
const split_face_8 = '/Assets/Media/Patterns/split-face-8.webp'
const split_face_9 = '/Assets/Media/Patterns/split-face-9.webp'
const split_face_10 = '/Assets/Media/Patterns/split-face-10.webp'

const pattern1 = '/Assets/Media/Patterns/pattern1.webp'
const pattern2 = '/Assets/Media/Patterns/pattern2.webp'
const pattern3 = '/Assets/Media/Patterns/pattern3.webp'
const pattern4 = '/Assets/Media/Patterns/pattern4.webp'

import Section from "../Section/Section";
import LangLink from '../LangLink';


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

        <div className='patterns-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                    <h1>{t('patterns.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <LangLink href="/">{t('patterns.breadcrumbHome')}</LangLink>
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