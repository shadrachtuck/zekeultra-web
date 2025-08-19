"use client";
import React, { useState } from 'react';
import { useCart } from '../store/CartContext';
import Link from 'next/link';

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 19L8 12L15 5" stroke="#fff" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5L16 12L9 19" stroke="#fff" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);

export default function ProductCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { dispatch } = useCart();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        price: product.price,
        priceId: product.priceId,
        currency: product.currency,
      },
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products available.</p>
      </div>
    );
  }

  const product = products[currentIndex];
  const productSlug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
        {/* Product Card */}
        <div className="bg-white rounded-lg border border-black overflow-hidden w-full">
          <Link href={`/store/${productSlug}`} className="block">
            <div className="aspect-square w-full">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-black mb-3">{product.name}</h3>
            </div>
          </Link>
          
          {/* Navigation with Arrows, Plus Button, and Dots */}
          {products.length > 1 && (
            <div className="flex items-center justify-between px-4 py-4">
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="w-8 bg-black flex items-center justify-center focus:outline-none hover:bg-gray-800 transition-colors p-1"
                aria-label="Previous"
              >
                <ArrowLeft />
              </button>
              
              {/* Center Section with Dots and Plus Button */}
              <div className="flex items-center space-x-4">
                {/* Left Dots */}
                <div className="flex space-x-1">
                  {products.slice(0, Math.ceil(products.length / 2)).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        idx === currentIndex ? 'bg-black scale-140' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                
                {/* Plus Button - Always Centered */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.price}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Add to cart"
                >
                  <PlusIcon />
                </button>
                
                {/* Right Dots */}
                <div className="flex space-x-1">
                  {products.slice(Math.ceil(products.length / 2)).map((_, idx) => (
                    <button
                      key={Math.ceil(products.length / 2) + idx}
                      onClick={() => setCurrentIndex(Math.ceil(products.length / 2) + idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        Math.ceil(products.length / 2) + idx === currentIndex ? 'bg-black scale-140' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${Math.ceil(products.length / 2) + idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="w-8 bg-black flex items-center justify-center focus:outline-none hover:bg-gray-800 transition-colors p-1"
                aria-label="Next"
              >
                <ArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
        </div>
      </section>
  );
} 