"use client"
import React, { useState, useEffect } from 'react';
import './style.css'


export default function Write({message}:any) {
    const [text, setText] = useState('');

    useEffect(() => {
        startTyping();
      }, []); 
  
    const startTyping = () => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index <= message.length) {
          setText(message.substring(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20); // Adjust typing speed as needed
    };
  
    return (
      <div className="writing-animation">
        <div className="typing-text">{text}</div>
      </div>
    );
}
