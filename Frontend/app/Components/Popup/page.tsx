"use client"
import React, { useState } from 'react';
import './style.css';

export default function PopupBox({data}:any) {
    
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="popup-container">
      <button onClick={togglePopup} className='p-5 border bg-white text-black align-middle'>View more details of {data?.device_ip}</button>
      {isOpen && (
        <div className="popup">
          <h2>{data?.device_ip}</h2>
          <p> Checking... </p>
          <p>Last seen: {data?.time || 'Online'}</p>
          <p>Type : {data?.type}</p>
          <button onClick={togglePopup}>Close</button>
        </div>
      )}
    </div>
  );
}
