import React from "react";

export default function AddressMap({ address }) {
  const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d106453.07238307402!2d31.1722617!3d29.944811!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458390007929e37%3A0x83f903df75caead0!2sWadidegla%20for%20marbl%20and%20granite!5e0!3m2!1sen!2seg!4v1741651658436!5m2!1sen!2seg`;

  return (
    <div style={{ width: "100%", height: "250px", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={googleMapsUrl}
      ></iframe>
    </div>
  );
}


{/* <iframe src="" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}