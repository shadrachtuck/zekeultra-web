"use client";
import { useState } from 'react';

export default function HamburgerMenu({ navLinks }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="z-50 hover:opacity-75 transition-opacity relative flex flex-col gap-[0.2rem] mb-[4px]"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <span 
          className={`block w-[1.5em] h-[0.2rem] transition-all duration-300 ${open ? 'bg-white' : 'bg-black'}`} 
          style={{ transform: open ? 'rotate(45deg) translateY(9px)' : 'none' }} 
        />
        <span className={`block w-[1.5em] h-[0.2rem] transition-all duration-300 ${open ? 'opacity-0 bg-white' : 'bg-black'}`} />
        <span 
          className={`block w-[1.5em] h-[0.2rem] transition-all duration-300 ${open ? 'bg-white' : 'bg-black'}`} 
          style={{ transform: open ? 'rotate(-45deg) translateY(-9px)' : 'none' }} 
        />
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 transition-opacity ml-n8" onClick={() => setOpen(false)} />
          {/* Drawer */}
          <nav className="relative w-64 h-full bg-black shadow-lg flex flex-col items-center p-6 gap-6 z-50 backdrop-blur-lg">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-white text-xl font-bold hover:opacity-75 transition-opacity pb-2 w-full"
                onClick={() => setOpen(false)}
                style={{ borderBottom: 'none' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
} 