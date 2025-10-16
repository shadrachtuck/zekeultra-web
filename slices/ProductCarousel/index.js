'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../components/store/CartContext';
import StoreClientWrapper from '../../components/store/StoreClientWrapper';
import Link from 'next/link';
import { createClient } from '../../lib/prismic';
import { createStripeInstance } from '../../lib/stripe';

const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);

const CheckmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
  </svg>
);

const ViewStoreArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);

export default function ProductCarousel({ slice }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const { dispatch } = useCart();

  // Check if we should use Stripe products or manual products
  // Default to true if the field is null/undefined (since the model default is true)
  const useStripeProducts = slice.primary.use_stripe_products === null || slice.primary.use_stripe_products === undefined 
    ? true 
    : Boolean(slice.primary.use_stripe_products) || slice.primary.use_stripe_products === 'true';
  
  // Check if we should show only featured products
  const showOnlyFeatured = slice.primary.show_only_featured === true;
  
  const manualProducts = slice.items || [];



  useEffect(() => {
    const fetchProducts = async () => {
      if (useStripeProducts) {
        try {
          const client = createClient();
          const siteSettings = await client.getSingle('site_settings');
          const stripeApiKey = siteSettings?.data?.stripe_private_api_key;
          
          if (stripeApiKey) {
            const stripe = createStripeInstance(stripeApiKey);
            const [stripeProducts, prices] = await Promise.all([
              stripe.products.list({ active: true }),
              stripe.prices.list({ active: true, expand: ['data.product'] })
            ]);
            
            const productMap = {};
            stripeProducts.data.forEach(product => {
              productMap[product.id] = { ...product, prices: [] };
            });
            
            prices.data.forEach(price => {
              if (price.product && productMap[price.product.id]) {
                productMap[price.product.id].prices.push(price);
              }
            });
            
            let processedProducts = Object.values(productMap)
              .filter(product => product.prices.length > 0)
              .map(product => {
                const price = product.prices[0];
                return {
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  images: product.images,
                  price: price ? price.unit_amount : null,
                  priceId: price ? price.id : null,
                  currency: price ? price.currency : 'usd',
                };
              });
            
            // Filter to show only featured products if enabled
            if (showOnlyFeatured && slice.primary.featured_product_names) {
              const featuredNames = slice.primary.featured_product_names
                .map(item => item.product_name?.toLowerCase().trim())
                .filter(Boolean);
              
              if (featuredNames.length > 0) {
                processedProducts = processedProducts.filter(product => 
                  featuredNames.some(featuredName => 
                    product.name.toLowerCase().includes(featuredName) ||
                    featuredName.includes(product.name.toLowerCase())
                  )
                );
              }
            }
            
            setProducts(processedProducts);
          } else {
            console.error('No Stripe API key found in site settings');
            setProducts([]);
          }
        } catch (error) {
          console.error('Error fetching Stripe products:', error);
          setProducts([]);
        }
      } else {
        // Use manual products
        let filteredManualProducts = manualProducts;
        
        // Filter manual products if featured filtering is enabled
        if (showOnlyFeatured && slice.primary.featured_product_names) {
          const featuredNames = slice.primary.featured_product_names
            .map(item => item.product_name?.toLowerCase().trim())
            .filter(Boolean);
          
          if (featuredNames.length > 0) {
            filteredManualProducts = manualProducts.filter(product => 
              featuredNames.some(featuredName => 
                (product.product_name || '').toLowerCase().includes(featuredName) ||
                featuredName.includes((product.product_name || '').toLowerCase())
              )
            );
          }
        }
        
        setProducts(filteredManualProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [useStripeProducts, manualProducts, showOnlyFeatured]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowCheckmark(true);
    
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: product.product_id || product.id,
        name: product.product_name || product.name,
        description: product.product_description || product.description,
        image: product.product_image?.url || product.images?.[0],
        price: product.product_price || product.price,
        priceId: product.stripe_price_id || product.priceId,
        currency: product.currency || 'usd',
      },
    });
    
    // Reset checkmark after animation
    setTimeout(() => {
      setShowCheckmark(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {useStripeProducts 
            ? "No products available. Please configure Stripe API key in site settings or add manual products."
            : showOnlyFeatured 
              ? "No featured products found. Check your site settings for featured product names."
              : "No products available."
          }
        </p>
      </div>
    );
  }

  const product = products[currentIndex];
  
  // Handle both manual and Stripe products
  const productName = product.product_name || product.name;
  const productImage = product.product_image?.url || product.images?.[0];
  const productPrice = product.product_price || product.price;
  const productPriceId = product.stripe_price_id || product.priceId;
  const productCurrency = product.currency || 'usd';
  
  const productSlug = productName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';

  return (
    <StoreClientWrapper>
              <section className="w-full">
          <div className="container mx-auto px-2">
            {products.length > 1 && (
              <div className="pb-4">
                <div className="flex justify-between items-center">
                  {showOnlyFeatured && (
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full px-2">
                      Featured merch
                    </div>
                  )}
                  <Link 
                    href="/store" 
                    className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors font-medium"
                  >
                    View store
                    <ViewStoreArrow />
                  </Link>
                </div>
              </div>
            )}
            
            <div className="mx-auto">
            {/* Product Card */}
            <div className="bg-white overflow-hidden w-full">
            <Link href={`/store/${productSlug}`} className="block">
              <div className="w-full">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={productName}
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
                <h3 className="text-xl font-bold text-black">{productName}</h3>
              </div>
            </Link>
            
            {/* Navigation with Arrows, Plus Button, and Dots */}
            {products.length > 1 ? (
              <div className="flex items-center justify-between px-2 pb-4">
                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 flex items-center justify-center p-1"
                  aria-label="Previous"
                >
                  <ArrowLeft />
                </button>
                
                {/* Center Section with Dots and Plus Button */}
                <div className="flex items-center justify-center flex-1 relative">
                  {/* Left Dots - Evenly spread */}
                  <div className="flex">
                    {products.slice(0, Math.ceil(products.length / 2)).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          idx === currentIndex ? 'bg-black scale-110 space-x-4' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Plus Button - Centered */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!productPrice}
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
                  
                  {/* Right Dots - Evenly spread */}
                  <div className="flex">
                    {products.slice(Math.ceil(products.length / 2)).map((_, idx) => (
                      <button
                        key={Math.ceil(products.length / 2) + idx}
                        onClick={() => setCurrentIndex(Math.ceil(products.length / 2) + idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          Math.ceil(products.length / 2) + idx === currentIndex ? 'bg-black scale-110' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${Math.ceil(products.length / 2) + idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 flex items-center justify-center p-1"
                  aria-label="Next"
                >
                  <ArrowRight />
                </button>
              </div>
            ) : (
              // Single product - just show centered add to cart button
              <div className="flex items-center justify-center px-2 pb-4">
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!productPrice}
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
      </StoreClientWrapper>
  );
} 