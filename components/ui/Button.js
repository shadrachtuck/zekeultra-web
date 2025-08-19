import React from 'react';

export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-black text-white font-semibold border-none rounded-none transition-colors duration-200 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 