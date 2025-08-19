import React from 'react';

export default function DrawerXIcon({ className = '', style = {} }) {
  return (
    <div className={`flex flex-col gap-[0.2rem] mb-[4px] ${className}`} style={style}>
      <span
        className="block w-[1.5em] h-[0.2rem] bg-black transition-all duration-300"
        style={{ transform: 'rotate(45deg) translateY(9px)' }}
      />
      <span className="block w-[1.5em] h-[0.2rem] opacity-0 bg-black transition-all duration-300" />
      <span
        className="block w-[1.5em] h-[0.2rem] bg-black transition-all duration-300"
        style={{ transform: 'rotate(-45deg) translateY(-9px)' }}
      />
    </div>
  );
} 