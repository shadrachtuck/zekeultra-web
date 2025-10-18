"use client";
import React, { useState } from 'react';
import { useCart } from '../store/CartContext';
import Button from './Button';
import { formatPrice } from '../../lib/stripe';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { id, name, description, images, price, priceId, currency, variants, variantType } = product;
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Create hyphenated slug from product name
  const productSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id,
        name,
        description,
        image: images?.[0],
        price,
        priceId,
        currency,
        variant: selectedVariant, // Include selected variant
        variantType,
      },
    });
  };

  return (
    <Link href={`/store/${productSlug}`} className="block hover:opacity-90 transition-opacity">
      <div className="border border-black bg-transparent flex flex-col h-full">
        {images?.[0] ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-80 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        <div className="p-2 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold mb-2 text-black">{name}</h3>
            
            {/* Variant Selection */}
            {variants && variants.length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1 capitalize">
                  Select {variantType}:
                </div>
                <div className="flex flex-wrap gap-1">
                  {variants.slice(0, 4).map((variant) => (
                    <button
                      key={variant}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVariant(variant);
                      }}
                      className={`
                        px-2 py-1 text-xs border transition-colors rounded
                        ${selectedVariant === variant 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      {variant}
                    </button>
                  ))}
                  {variants.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      +{variants.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg text-black">
              {price ? formatPrice(price, currency) : 'Price not available'}
            </span>
            <Button
              className="w-fit px-2 py-1"
              onClick={handleAddToCart}
              disabled={!price || (variants && variants.length > 0 && !selectedVariant)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
} 