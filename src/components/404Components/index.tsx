import React from 'react';
import './style.css'; // Optional: Add a separate CSS file for styling

const NotFoundPageComponent: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1 className="error-code">404</h1>
      <p className="error-message">Oops! The page you're looking for doesn't exist.</p>
      <a href="/home" className="back-home">Go Back to Home</a>
    </div>
  );
};

export default NotFoundPageComponent;
