import React from "react";
import './Home.css';
import Galala from '../Assets/Media/Products/Galala.png'
import Sunny_Menia from '../Assets/Media/Products/Sunny-Menia.png'
import Selvia_Menia from '../Assets/Media/Products/Selvia-Menia.png'
import Felitto from '../Assets/Media/Products/Felitto.png'



export default function Product(props){
    return (
                <div className="product-card">
                    <img src={props.url} alt />
                    <h3>{props.name}</h3>
                    <a href>Learn More </a>
                </div>
           

    )
}