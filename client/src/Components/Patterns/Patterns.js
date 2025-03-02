import React, {useState} from "react";
import './Patterns.css';
import ContactBubble from "../Contact/ContactBubble";

import p1 from '../../Public/Assets/Media/Patterns/p1.png'
import p2 from '../../Public/Assets/Media/Patterns/p2.png'
import p3 from '../../Public/Assets/Media/Patterns/p3.png'
import p4 from '../../Public/Assets/Media/Patterns/p4.png'
import pavers1 from '../../Public/Assets/Media/Patterns/pavers1.png'
import pavers2 from '../../Public/Assets/Media/Patterns/pavers2.png'
import pavers3 from '../../Public/Assets/Media/Patterns/pavers3.png'
import pavers4 from '../../Public/Assets/Media/Patterns/pavers4.png'
import s1 from '../../Public/Assets/Media/Patterns/1.png'
import s2 from '../../Public/Assets/Media/Patterns/2.png'
import s3 from '../../Public/Assets/Media/Patterns/3.png'
import s4 from '../../Public/Assets/Media/Patterns/4.png'
import s5 from '../../Public/Assets/Media/Patterns/5.png'
import s6 from '../../Public/Assets/Media/Patterns/6.png'
import s7 from '../../Public/Assets/Media/Patterns/7.png'
import s8 from '../../Public/Assets/Media/Patterns/8.png'
import s9 from '../../Public/Assets/Media/Patterns/9.png'
import s10 from '../../Public/Assets/Media/Patterns/10.png'
import split_face_1 from '../../Public/Assets/Media/Patterns/split-face-1.png'
import split_face_2 from '../../Public/Assets/Media/Patterns/split-face-2.png'
import split_face_3 from '../../Public/Assets/Media/Patterns/split-face-3.png'
import split_face_4 from '../../Public/Assets/Media/Patterns/split-face-4.png'
import split_face_5 from '../../Public/Assets/Media/Patterns/split-face-5.png'
import split_face_6 from '../../Public/Assets/Media/Patterns/split-face-6.png'
import split_face_7 from '../../Public/Assets/Media/Patterns/split-face-7.png'
import split_face_8 from '../../Public/Assets/Media/Patterns/split-face-8.png'
import split_face_9 from '../../Public/Assets/Media/Patterns/split-face-9.png'
import split_face_10 from '../../Public/Assets/Media/Patterns/split-face-10.png'


export default function Patterns(){
const [paver, setPaver] = useState(pavers1);
const [splitFace, setSplitFace] = useState(split_face_1);

    
    
    return(
        <div className='patterns-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>PATTERNS</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Patterns</p>
                        </div>
                </div>  
            <div className="pattern-section">
                <div className="pattern-section-left">
                    <h2>Marble Pavers</h2>
                    <p>Select a material from below to appear on this scenery</p>
                    <div className="pattern-section-left-materials">
                        <img onClick={()=>setPaver(pavers1)} src={p1} alt="Marble Pavers 1"/>
                        <img onClick={()=>setPaver(pavers2)} src={p2} alt="Marble Pavers 2"/>
                        <img onClick={()=>setPaver(pavers3)} src={p3} alt="Marble Pavers 3"/>
                        <img onClick={()=>setPaver(pavers4)} src={p4} alt="Marble Pavers 4"/>
                    </div>
                </div>
                <div className="pattern-section-right">
                    <img src={paver} alt="Marble Pavers"/>
                    </div>
    
            </div>

            <div id='pattern-section-splitface' className="pattern-section">
                <div className="pattern-section-left">
                    <h2>Marble Split Face</h2>
                    <p>Select a material from below to appear on this scenery</p>
                    <div id="pattern-section-left-materials-splitface" className="pattern-section-left-materials">
                        <img onClick={()=>setSplitFace(split_face_1)} src={s1} alt="split face 1"/>
                        <img onClick={()=>setSplitFace(split_face_2)} src={s2} alt="split face 2"/>
                        <img onClick={()=>setSplitFace(split_face_3)} src={s3} alt="split face 3"/>
                        <img onClick={()=>setSplitFace(split_face_4)} src={s4} alt="split face 4"/>
                        <img onClick={()=>setSplitFace(split_face_5)} src={s5} alt="split face 5"/>
                        <img onClick={()=>setSplitFace(split_face_6)} src={s6} alt="split face 6"/>
                        <img onClick={()=>setSplitFace(split_face_7)} src={s7} alt="split face 7"/>
                        <img onClick={()=>setSplitFace(split_face_8)} src={s8} alt="split face 8"/>
                        <img onClick={()=>setSplitFace(split_face_9)} src={s9} alt="split face 9"/>
                        <img onClick={()=>setSplitFace(split_face_10)} src={s10} alt="split face 10"/>

                    </div>
                </div>
                <div className="pattern-section-right">
                    <img src={splitFace} alt="split face"/>
                    </div>
    
            </div>

            <ContactBubble />
            </div>    
            )
}