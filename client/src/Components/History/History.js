import React from 'react';
import './History.css';
import MasonryGrid from '../MasonryGrid/MasonryGrid';
import ContactBubble from '../Contact/ContactBubble';
import CountUp from 'react-countup';
import history7 from '../../Public/Assets/Media/History/history7.jpg'
import sameh_ghanam from '../../Public/Assets/Media/History/sameh-ghanam.jpg'
import saeed_jr from '../../Public/Assets/Media/History/saeed-jr.png'
import saeed_jr_2 from '../../Public/Assets/Media/History/saeed-jr-2.jpeg'
import saeed_jr_3 from '../../Public/Assets/Media/History/saeed-jr-3.jpeg'
import saeed_jr_4 from '../../Public/Assets/Media/History/saeed-jr-4.jpeg'
import saeed_jr_5 from '../../Public/Assets/Media/History/saeed-jr-5.jpeg'

import history1 from '../../Public/Assets/Media/History/history1.jpg'
import history2 from '../../Public/Assets/Media/History/history2.jpg'
import history3 from '../../Public/Assets/Media/History/history3.jpg'
import history4 from '../../Public/Assets/Media/History/history4.jpg'
import history5 from '../../Public/Assets/Media/History/history5.jpg'
import history6 from '../../Public/Assets/Media/History/history6.jpg'
import history8 from '../../Public/Assets/Media/History/history8.jpg'
import history9 from '../../Public/Assets/Media/History/history9.jpg'
import history10 from '../../Public/Assets/Media/History/history10.jpg'
import history11 from '../../Public/Assets/Media/History/history11.jpg'
import history12 from '../../Public/Assets/Media/History/history12.jpg'
import history13 from '../../Public/Assets/Media/History/history13.jpg'
import history14 from '../../Public/Assets/Media/History/history14.jpg'
import history15 from '../../Public/Assets/Media/History/history15.jpg'
import history16 from '../../Public/Assets/Media/History/history16.jpg'
import history17 from '../../Public/Assets/Media/History/history17.jpg'
import history18 from '../../Public/Assets/Media/History/history18.jpg'
import history19 from '../../Public/Assets/Media/History/history19.jpg'
import history20 from '../../Public/Assets/Media/History/history20.jpg'
import history21 from '../../Public/Assets/Media/History/history21.jpg'
import history22 from '../../Public/Assets/Media/History/history22.jpg'
import history23 from '../../Public/Assets/Media/History/history23.jpg'
import history25 from '../../Public/Assets/Media/History/history25.jpg'
import history26 from '../../Public/Assets/Media/History/history26.jpg'
import history27 from '../../Public/Assets/Media/History/history27.jpg'
import history28 from '../../Public/Assets/Media/History/history28.jpeg'
import history29 from '../../Public/Assets/Media/History/history29.jpeg'
import history30 from '../../Public/Assets/Media/History/history30.jpeg'




export default function History(){
    const images = [
        history1,
        history2,
        history3,
        history4,
        history5,
        history6,
        history7,
        history8,
        history9,
        history10,
        history11,
        history12,
        history13,
        history14,
        history15,
        history16,
        history17,
        history18,
        history19,
        history20,
        history21,
        history22,
        history23,
        history25,
        history26,
        history27,
        history28,
        history29,
        history30
    ];
    

    return(
        <div className='history-container'>
            {/* 🌟 Hero Section */}
            <div className="quarries-hero">
                <h1>OUR HISTORY</h1>
                <div className="breadcrumb">
                <a href="/">Home</a>
                <p>{'>'} History</p>
                </div>
            </div>  
            {/* Intro Section */}
            <div className="history-intro-section">
                <div className="history-intro-section-title">
                <h1>FOUNDED IN</h1>
                <CountUp start={2025}
                            end={1980}
                            duration={3}
                            delay={2}
                            enableScrollSpy={true}
                            separator=""
                            suffix=""
                            style={{ fontSize: '100px', fontWeight: 900, color: 'var(--goldColor)'}} 
                />
                </div>
                <p className="first-gen-intro">Since 1951, <strong>Alghanam family</strong> has been synonymous with innovation and leadership in 
                    Egypt’s marble and granite quarrying industry. Our story is rooted in determination, <strong>ambition</strong>, and 
                    a deep <strong>respect</strong> for the natural resources that define our country’s rich 
                    geological <strong>heritage</strong>. Over the decades, many prominent members of the Alghanam family 
                    have secured and safeguarded the quarrying industry in Egypt—<strong>because it truly runs in 
                    our veins</strong>.
                </p>

            </div>
            

                <div className="first-gen-section">
                    <div className="first-gen-title">
                        <hr/>
                        <h2>The Visionary Beginnings</h2>
                    </div>
                    <div className="first-gen-section-content">
                        <div className="first-gen-section-text">
                            <p>The true turning point in our family’s journey came in 1980 with the ambition of our founder, <strong>Alhag Saed Alghanam</strong>. Determined 
                                to master the art and science of quarrying, he immersed himself in the craft, learning everything from extraction techniques 
                                to material quality. His curiosity led him to the iconic Galala Mountain, a site previously unknown for its marble potential. Taking a 
                                tremendous risk, he opened the first Galala quarry, uncertain of the mountain’s capacity or commercial value. History would prove their instincts 
                                right: Galala marble soon became one of Egypt’s most prized resources, drawing visits and praise from the world’s largest importers of 
                                raw material blocks.
                                <br/><br/>
                                Encouraged by the success of the Galala quarry, Alhag Saed Alghanam continued to explore new sites, founding the Zafraana, Samaha, and 
                                Sunny Elsheikh Fadl quarries. Over time, the Alghanam family secured more than 50 active quarries wadeidegla under alhag saed alghanam 
                                leadership owned 7 quarries of them across the Galala mountain alone. This extensive quarry network allowed us to supply to  top 
                                exporter in Egypt they was the first to show the whole world the galala marble , elevating our 
                                country’s standing in monumental projects around the globe.
                                </p>
                        </div>
                        <div className="first-gen-section-image">
                            <img src={history16} alt="history-7"/>
                        </div>
                    </div>

            </div>

            <div className="second-gen-section">
                    <div className="second-gen-title">
                        <hr/>
                        <h2>Passing the Torch to the Second Generation</h2>
                    </div>
                    <div className="second-gen-section-content">
                        <div className="second-gen-section-text">
                            <p>While the quarries thrived,  <strong>Alhag Sameh Alghanam</strong>—son of Alhag Saed—was gaining hands-on experience . In 2000, the family opened its 
                                first factory, expanding operations from raw material extraction to fabrication and processing. Alhag 
                                Sameh forged strategic partnerships with some of China’s largest companies, who relied heavily on our 
                                quarries’ production.
                                <br/><br/>
                                As demand grew, so did our footprint: in 2011, the second factory was launched, followed by new 7 quarries in the Galala mountain  For 17 years, we 
                                maintained our strong relationship with the Chinese market, sustaining a robust local 
                                presence. Eventually, the third factory came into operation, further strengthening our production 
                                capacity and enabling us to meet the escalating demand for Egyptian marble and granite.
                                </p>
                        </div>
                        <div className="second-gen-section-image">
                            <img src={sameh_ghanam} alt="sameh-ghanam"/>
                        </div>
                    </div>

            </div>

            <div className="third-gen-section">
                    <div className="third-gen-title">
                        <hr/>
                        <h2>The Rise of a New Generation</h2>
                    </div>
                    <div className="third-gen-section-content">
                    <div className="third-gen-section-image">
                            <img src={saeed_jr} alt="saeed-ghanam"/>
                        </div>

                        <div className="third-gen-section-text">
                            <p>When <strong>Saed Alghanam</strong>, the third generation, entered the scene, he was no stranger to the business. From 
                                the age of 11, he spent summers and winters in the quarries and factories, learning side by side 
                                with his father and grandfather. By the time he graduated college in 2022, Saed brought a fresh 
                                perspective and an enduring passion for global business. Determined to expand beyond the local 
                                market, he established Wadi Degla Global Exporting, dedicated to showcasing Egyptian marble and 
                                granite on an international stage.
                                <br/><br/>
                                Around the same time, the family opened the Creamy White Pearl Quarry in Sinai—an even lighter 
                                and brighter version of Galala marble, exclusive to Wadi Degla. With control over three major 
                                quarries in Egypt, the Alghanam family began promoting Creamy White Pearl as a limited-edition 
                                signature product.
                                <br/><br/>
                                <strong id="third-gen-mid-text-title">Growing Global Influence:</strong>
                                <br/>
                                Under Saed’s leadership, we embarked on a new era of worldwide export and distribution. We first 
                                targeted Latin America, supplying prestigious mega-projects and luxury hotels. Our high-quality 
                                materials quickly gained a strong reputation, spurring further expansions into Europe and 
                                Africa. Today, Wadi Degla’s footprint can be found in marquee developments across the globe, from 
                                grand hotel lobbies to soaring architectural landmarks.
                                </p>
                        </div>
                        <div className="third-gen-section-gallery">
                            <img src={saeed_jr_2} alt="saeed-ghanam"/>
                            <img src={saeed_jr_3} alt="saeed-ghanam"/>
                            <img src={saeed_jr_4} alt="saeed-ghanam"/>
                            <img src={saeed_jr_5} alt="saeed-ghanam"/>

                        </div>

                    </div>

            </div>

            <div className="legacy-section">
                    <div className="legacy-title">
                        <hr/>
                        <h2>A Living Legacy</h2>
                    </div>
                    <div className="legacy-section-content">
                        <div className="legacy-section-text">
                            <p>Throughout our history, the Alghanam family has produced numerous influential figures who have all played 
                                pivotal roles in securing and shaping Egypt’s quarrying industry. 
                                <br/>
                                This passion has been passed down through generations—<strong>it’s in our veins.</strong>
                                </p>
                                <br/>
                                <p>In tribute to our rich history, we proudly share <strong>photographs</strong> of Alhag Saed Alghanam from the 1980s and 
                                    1990s, both in <strong>Egyptian quarries</strong> and abroad—particularly in <strong>Turkey</strong>, where he explored international 
                                    partnerships. These images symbolize our ongoing commitment to excellence, tradition, and global 
                                    collaboration.</p>
                        </div>
                        
                        <MasonryGrid props={images}/>
                            
                    </div>


            </div>
            <div className='history-final-section'>
                        <p>Decades of expertise, three generations of visionary leaders, and an unwavering dedication to 
                            quality have earned the Alghanam family—and Wadi Degla—a place at the forefront of the 
                            marble and granite industry. We continue to push the boundaries of quarrying and 
                            fabrication, pioneering new techniques and materials that uphold our family’s time-honored 
                            standards of craftsmanship.</p>

                        <p>From Galala to the World, our journey is a testament to what passion, perseverance, and ingenuity 
                            can achieve. As we look to the future, we remain true to the same principles that guided our 
                            founders: respect for nature’s gifts, dedication to excellence, and an unyielding commitment to 
                            sharing Egypt’s finest marble and granite with the world.</p>   
                    
                    </div>


                    <ContactBubble />

        </div>    
            )
}