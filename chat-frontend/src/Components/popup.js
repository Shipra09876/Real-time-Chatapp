// src/Components/Popup.js
import React from 'react';

const Popup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#333',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '10px',
      zIndex: 1000,
      transition: 'opacity 0.5s'
    }}>
      <span>{message}</span>
      <button onClick={onClose} style={{
        marginLeft: '10px',
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>X</button>
    </div>
  );
};

export default Popup;
