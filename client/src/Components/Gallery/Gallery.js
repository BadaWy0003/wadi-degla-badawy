import React, { useState, useEffect } from 'react'
import './Gallery.css'
// import { Link } from "react-router-dom";
// import wadi_degla_logo_login from '../../Public/Assets/wadi-degla-logo-login.svg'
import LightGallery from "lightgallery/react/Lightgallery.es5";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css"
import "lightgallery/css/lg-autoplay.css"
import "lightgallery/css/lg-share.css"
import "lightgallery/css/lg-rotate.css"
// import lgThumbnail from "lightgallery/plugins/thumbnail"
// import lgZoom from "lightgallery/plugins/zoom"
// import lgAutoplay from "lightgallery/plugins/autoplay"
// import lgVideo from "lightgallery/plugins/video"
// import lgShare from "lightgallery/plugins/share"
// import lgRotate from "lightgallery/plugins/rotate"
// import image1 from '/Assets/Media/Gallery/1.jpg'
// import image2 from '/Assets/Media/Gallery/2.jpg'
// import image3 from '/Assets/Media/Gallery/3.jpg'
// import image4 from '/Assets/Media/Gallery/4.jpg'
// import image5 from '/Assets/Media/Gallery/5.jpg'
// import image6 from '/Assets/Media/Gallery/6.jpg'
// import image7 from '/Assets/Media/Gallery/7.jpg'
// import image8 from '/Assets/Media/Gallery/8.jpg'
// import image9 from '/Assets/Media/Gallery/9.jpg'
// import image10 from '/Assets/Media/Gallery/10.jpg'
// import image11 from '/Assets/Media/Gallery/11.jpg'
// import image12 from '/Assets/Media/Gallery/12.jpg'
// import image13 from '/Assets/Media/Gallery/13.jpg'
// import image14 from '/Assets/Media/Gallery/14.jpg'
// import image15 from '/Assets/Media/Gallery/15.jpg'
// import image16 from '/Assets/Media/Gallery/16.jpg'
// import image17 from '/Assets/Media/Gallery/17.jpg'
// import image18 from '/Assets/Media/Gallery/18.jpg'
// import image19 from '/Assets/Media/Gallery/19.jpg'
// import image20 from '/Assets/Media/Gallery/20.jpg'
// import image21 from '/Assets/Media/Gallery/21.jpg'
// import image22 from '/Assets/Media/Gallery/22.jpg'
// import image23 from '/Assets/Media/Gallery/23.jpg'
// import image24 from '/Assets/Media/Gallery/24.jpg'
// import image25 from '/Assets/Media/Gallery/25.jpg'
// import image26 from '/Assets/Media/Gallery/26.jpg'
// import image27 from '/Assets/Media/Gallery/27.jpg'
// import image29 from '/Assets/Media/Gallery/29.jpg'
// import image30 from '/Assets/Media/Gallery/30.jpg'
// import image31 from '/Assets/Media/Gallery/31.jpg'



export default function Gallery() {
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        const fetchGallery = async () => {
            const typeName = "Gallery";
            const url = `${process.env.REACT_APP_BASE_API_URL}/api/storage/type/${typeName}`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch Gallery');
                const { data } = await response.json();
                setGallery(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error:', error);
                setGallery([]);
            }
        };

        fetchGallery();
    }, []);

    return (
        <div className='gallery-container'>
            <div className="gallery-hero">
                <div className="gallery-hero-bg"></div>
                <div className='page-title'>
                    <h1>GALLERY</h1>
                    <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Gallery</p>
                    </div>
                </div>
            </div>
            <div className="gallery-gallery">
                <LightGallery
                    elementClassNames="custom-wrapper-class"

                >
                    {gallery.map((item, i) => (
                        item.finishes && item.finishes[0]?.link && (
                            <img
                                alt={item.name || ''}
                                src={item.finishes[0].link}
                                key={item.id || i}
                                className="image-ingallery"
                                loading="lazy"
                            />
                        )
                    ))}
                </LightGallery>
            </div>
        </div>
    )
}
