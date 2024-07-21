import React from "react";

export default function Gallery(props){

    return (
        <div style={{columns: props.columnCount, columnGap: 5}}>
            {props.galleryUrl.map((img, i) =>
                <img src={img} key={i} className="image" style={{padding: props.gap/2 }} loading="lazy" alt=""/>)}
        </div>
    )
}