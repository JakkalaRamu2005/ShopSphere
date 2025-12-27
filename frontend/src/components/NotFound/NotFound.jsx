
import React from "react";
import "./notfound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <img
        src="https://res.cloudinary.com/dcsglluc4/image/upload/v1760519143/pngtree-page-not-found-png-image_6674563_f6gjce.jpg"
        alt="404 Not Found"
        className="notfound-image"
      />
      <h1 className="notfound-heading">Oops! Page Not Found</h1>
      <p className="notfound-text">
        The page you are looking for does not exist. It might have been removed or the URL is incorrect.
      </p>
      <a href="/" className="notfound-button">Go Back Home</a>
    </div>
  );
}

export default NotFound;
