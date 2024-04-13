import React from 'react';
import './App.css'; // Import CSS file with styles

function Sumitvideo() {
  return (
    <div className="video-container">
      <iframe
        width="894"
        height="503"
        src="https://www.youtube.com/embed/0jO5Z0_pNBU?hd=1"
        title="What is SoftApply?"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default Sumitvideo;
