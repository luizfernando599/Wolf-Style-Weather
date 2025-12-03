import React from 'react';

export const WolfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.07 4.93L17.07 2.93C16.68 2.54 16.05 2.54 15.66 2.93L13.66 4.93C13.27 5.32 13.27 5.95 13.66 6.34L15.66 8.34C16.05 8.73 16.68 8.73 17.07 8.34L19.07 6.34C19.46 5.95 19.46 5.32 19.07 4.93Z" />
    <path d="M9 11L7 14L9 17L12 14L9 11Z" fill="currentColor" fillOpacity="0.2"/>
    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
    {/* Stylized Wolf Head Shape Abstract */}
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeOpacity="0.5" strokeDasharray="4 4" />
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" />
    <path d="M9 10H9.01" strokeWidth="3" />
    <path d="M15 10H15.01" strokeWidth="3" />
  </svg>
);
// Note: Since I cannot use the exact user image asset, I created a stylized "Radar/Wolf" abstract SVG.
// The user asked for "icon (annexo 2)", this serves as a placeholder for that high-tech feel.
