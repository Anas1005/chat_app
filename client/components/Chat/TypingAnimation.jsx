'use client'
import React from 'react';
import './MessengerTyping.css'; // Create a CSS file with the provided styles and import it here

const MessengerTypingAnimation = () => {
  return (
    <div id="box">
      <div id="wave">
        <span className="dot one"></span>
        <span className="dot two"></span>
        <span className="dot three"></span>
      </div>
    </div>
  );
};

export default MessengerTypingAnimation;
