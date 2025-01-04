import React, {useState} from "react";
import './Home.css';
import { Link } from "react-router-dom";
// import hero_bg from '../../Public/Assets/Media/hero-bg.jpg';
// import home_bg from '../../Public/Assets/Media/home-bg2.jpg'
// import wadi_degla_icon from '../../Public/Assets/Icons/wadi-degla-logo-icon.svg'
// import Galala from '../../Public/Assets/Media/Products/Galala.png'
// import Sunny_Menia from '../../Public/Assets/Media/Products/Sunny-Menia.png'
// import Selvia_Menia from '../../Public/Assets/Media/Products/Selvia-Menia.png'
// import Felitto from '../../Public/Assets/Media/Products/Felitto.png'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Product from '../Products/Product';
import Modal from '../Products/Modal';
import { productData } from '../Products/productData';
import company_logo from '../../Public/Assets/Icons/partners/company-logo.svg'
// import company_logo_2 from '..Public/Assets/Icons/partners/company-logo-2.svg'
// import company_logo_3 from '../../Public/Assets/Icons/partners/company-logo-3.svg'
// import company_logo_4 from '../../Public/Assets/Icons/partners/company-logo-4.svg'
// import company_logo_5 from '../../Public/Assets/Icons/partners/company-logo-5.svg'
// import company_logo_6 from '../../Public/Assets/Icons/partners/company-logo-6.svg'
// import company_logo_7 from '../../Public/Assets/Icons/partners/company-logo-7.svg'
// import company_logo_8 from '../../Public/Assets/Icons/partners/company-logo-8.svg'
// import company_logo_9 from '../../Public/Assets/Icons/partners/company-logo-9.svg'
// import company_logo_10 from '../../Public/Assets/Icons/partners/company-logo-10.svg'

import bullseye_gold from '../../Public/Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../../Public/Assets/Icons/paper-plane-gold.svg'
import Gallery from './Gallery-Home'
// import image1 from '/Assets/Media/Gallery/1.jpg'
// import image2 from '/Assets/Media/Gallery/2.jpg'
// import image3 from '/Assets/Media/Gallery/3.jpg'
// import image4 from '/Assets/Media/Gallery/4.jpg'
// import image5 from '/Assets/Media/Gallery/5.jpg'
// import image6 from '/Assets/Media/Gallery/6.jpg'
// import image7 from '/Assets/Media/Gallery/7.jpg'
// import image8 from '/Assets/Media/Gallery/8.jpg'
// import image9 from '/Assets/Media/Gallery/9.jpg'
import { useGlobalState } from '../GlobalStateContext.js';

//slamo 3leko



export default function Home(){
  const globalState = useGlobalState(); // Access global state for user data

    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);


    const galleryUrl = [
        '/Assets/Media/Gallery/1.jpg',
         '/Assets/Media/Gallery/2.jpg',
         '/Assets/Media/Gallery/3.jpg',
         '/Assets/Media/Gallery/4.jpg',
         '/Assets/Media/Gallery/5.jpg',
         '/Assets/Media/Gallery/6.jpg',
         '/Assets/Media/Gallery/7.jpg',
         '/Assets/Media/Gallery/8.jpg',
         '/Assets/Media/Gallery/9.jpg'
    ]



    // Function to handle opening the modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

    const featuredProducts = productData.slice(0, 8);
    
    const responsive1 = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 4
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
      
      // console.log("GlobalState.loggedIn: " + globalState.isLoggedIn + " GlobalState.token: "+ globalState.token );
      console.log("HOME/////GlobalState.fullname: " + globalState.fullName + 
        " GlobalState.companyName: "+ globalState.companyName + " GlobalState.address: "
         + globalState.address + " GlobalState.whatsapp: " + globalState.whatsapp + 
        "GlobalState.port: "+ globalState.port + " GlobalState.isLoggedIn: " + globalState.isLoggedIn + 
        " GlobalState.token: "+globalState.token + " GlobalState.rnc: "+globalState.rnc + 
        " GlobalState.country: "+globalState.country + " GlobalState.countryCode: "+globalState.countryCode
      +" GlobalState.email: "+globalState.email+" GlobalState.phone: "+globalState.phone);
    return(
        <div className="homepage">
            <div className="hero">
                <div className="hero-background"></div>
                <div className="banner">
                    <h1>Wadi Degla for marble & Granite</h1>
                    <p>Welcome to Wadi Degla for Marble & Granite, your trusted partner in the marble business since 1980.</p>
                        <div className="place4btns">
                            <Link to='/about' onClick={() => {window.scrollTo(0, 0);}}><button className="btn2">ABOUT US</button></Link>

                            <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}><button className="btn1">OUR PRODUCTS</button></Link>

                        </div>
                </div>
            </div>
            <div className="about-home">
            <h1>About Wadi Degla</h1>
                <div className="mission-vision">
                    <div className="mission">
                        <img src={bullseye_gold} alt=""/>
                        <div>
                            <h1>Mission</h1>
                            <p>To best serve the construction industry by supplying the highest quality of natural 
                                marbles and stones, and to grow unlimitedly as one of the best manufacturers of marbles
                                 in the Middle-East and the world.</p>
                            </div>
                        </div>
                    <div className="vision">
                    <img src={paper_plane_gold} alt=""/>
                        <div>
                            <h1>Vision</h1>
                            <p>To be recognized worldwide as one of the most reliable suppliers of best quality marbles, 
                                granite, and decorative stones.</p>
                            </div>
                    </div>
                </div>
                <Link to='/about' onClick={() => {window.scrollTo(0, 0);}}><button className="btn2">ABOUT US</button></Link>
                </div>
            {/* <div className="products-home">
                <h1>Explore some of our products</h1>
                <Carousel responsive={responsive1} 
                            swipeable={true}
                            showDots={true}
                            ssr={true} 
                            infinite={true}
                            keyBoardControl={true}
                            transitionDuration={500}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px"        
                >  
                    {featuredProducts.map(item => (
            <Product 
              key={item.id} 
              item={item} 
            />
          ))}
                </Carousel>
                <div className="products-btn-plc">
                <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}><button className="btn1">EXPLORE ALL</button></Link>
                </div>
            </div> */}
            {/* Modal for showing product details */}
      {/* {isModalOpen && selectedProduct && (
        <Modal product={selectedProduct} onClose={closeModal} />
      )} */}
            <div className="our-partners">
                <h1>Our Partners</h1>
                <Carousel responsive={responsive2}
                            swipeable={true}
                            showDots={false}
                            arrows={false}
                            ssr={true} 
                            infinite={true}
                            keyBoardControl={true}
                            transitionDuration={500}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px" 
                >
                    <img alt='' src={company_logo} />
                    {/*<img src={company_logo_2} />
                    <img src={company_logo_3} />
                    <img src={company_logo_4} />
                    <img src={company_logo_5} />
                    <img src={company_logo_6} />
                    <img src={company_logo_7} />
                    <img src={company_logo_8} />
                    <img src={company_logo_9} />
    <img src={company_logo_10} />*/}



                </Carousel>
            </div>

            <div className="gallery-home">
                <h1>Gallery</h1>
                <Gallery galleryUrl={galleryUrl} columnCount="3" gap="5"/>
                
                <Link to='/gallery' onClick={() => {window.scrollTo(0, 0);}}><button className="btn2">VIEW ALL</button></Link>
            </div>
        </div>
    )
}
           
