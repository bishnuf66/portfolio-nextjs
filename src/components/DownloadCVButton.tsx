import React from 'react';

const DownloadCVButton = () => {
  return (
    <a
      href="/assets/Bishnu-Bk-CV.pdf" // Path to your CV file in the public folder
      download="Bishnu_CV.pdf" // The name the file will be downloaded as
      target="_blank" // Optional: Opens in a new tab before download
      rel="noopener noreferrer"
    >
      <button
        style={{
          padding: '5px 10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Download CV
      </button>
    </a>
  );
};

export default DownloadCVButton;
