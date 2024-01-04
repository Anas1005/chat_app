// components/AudioNotification.js
'use client'
import React from 'react';

const AudioNotification = () => {
  return (
    <audio id="notificationSound" src="/assets/mixkit-bell-notification-933.wav" preload="auto"></audio>
  );
};

export default AudioNotification;
