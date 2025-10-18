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

const CheckmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
  </svg>
);

export default function ProductCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({}); // Track selected variant per product
  const { dispatch } = useCart();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const handleVariantSelect = (productId, variant) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Adding to cart:', product);
    console.log('Product price:', product.price);
    
    setShowCheckmark(true);
    
    // Add to cart immediately but show checkmark animation
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
        variant: selectedVariants[product.id], // Include selected variant
        variantType: product.variantType,
      },
    });
    
    // Reset checkmark after animation
    setTimeout(() => {
      setShowCheckmark(false);
    }, 1200);
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
  
  console.log('Current product:', product);
  console.log('Product price:', product.price);
  console.log('Button disabled:', !product.price);

  return (
    <section className="w-full py-12">
      <div className="container mx-auto">
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
            <div className="p-2 text-center">
              <h3 className="text-xl font-bold text-black">{product.name}</h3>
              
              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-2 capitalize">
                    Select {product.variantType}:
                  </div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariants[product.id] === variant;
                      return (
                        <button
                          key={variant}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleVariantSelect(product.id, variant);
                          }}
                          className={`
                            px-2 py-1 text-xs border transition-colors rounded
                            ${isSelected 
                              ? 'border-black bg-black text-white' 
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}
                          `}
                        >
                          {variant}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Link>
          
          {/* Navigation with Arrows, Plus Button, and Dots */}
          {products.length > 1 ? (
            <div className="flex items-center justify-between">
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="w-8 bg-black flex items-center justify-center focus:outline-none hover:bg-gray-800 transition-colors"
                aria-label="Previous"
              >
                <ArrowLeft />
              </button>
              
              {/* Center Section with Dots and Plus Button */}
              <div className="flex items-center">
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
                  disabled={!product.price || (product.variants && product.variants.length > 0 && !selectedVariants[product.id])}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Add to cart"
                >
                  {showCheckmark ? (
                    <div className="animate-pulse">
                      <CheckmarkIcon />
                    </div>
                  ) : (
                    <PlusIcon />
                  )}
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
                className="w-8 bg-black flex items-center justify-center focus:outline-none hover:bg-gray-800 transition-colors"
                aria-label="Next"
              >
                <ArrowRight />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={!product.price || (product.variants && product.variants.length > 0 && !selectedVariants[product.id])}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add to cart"
              >
                {showCheckmark ? (
                  <div className="animate-pulse">
                    <CheckmarkIcon />
                  </div>
                ) : (
                  <PlusIcon />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
        </div>
      </section>
  );
} 