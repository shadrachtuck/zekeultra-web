"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../../../components/store/CartContext';
import { formatPrice } from '../../../lib/stripe';
import Button from '../../../components/ui/Button';
import DrawerXIcon from '../../../components/ui/DrawerXIcon';
import Link from 'next/link';
import { createStripeInstance } from '../../../lib/stripe';
import { createClient } from '../../../lib/prismic';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product data using the same method as homepage
        const client = createClient();
        const siteSettings = await client.getSingle('site_settings');
        const stripeApiKey = siteSettings?.data?.stripe_private_api_key;
        
        if (stripeApiKey) {
          const stripe = createStripeInstance(stripeApiKey);
          const [products, prices] = await Promise.all([
            stripe.products.list({ active: true }),
            stripe.prices.list({ active: true, expand: ['data.product'] })
          ]);
          
          const productMap = {};
          products.data.forEach(product => {
            productMap[product.id] = { ...product, prices: [] };
          });
          
          prices.data.forEach(price => {
            if (price.product && productMap[price.product.id]) {
              productMap[price.product.id].prices.push(price);
            }
          });
          
          const productList = Object.values(productMap)
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

          // Find the product by slug (hyphenated name)
          const targetProduct = productList.find(p => {
            const productSlug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return productSlug === params.id;
          });

          if (targetProduct) {
            setProduct(targetProduct);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
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
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p>Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-8 pb-4">Product Not Found</h1>
            <p className="text-xl text-gray-300 mb-8">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <a
              href="/#store"
              className="inline-block px-8 py-3 bg-white text-black font-semibold hover:bg-black hover:text-white transition-colors duration-200"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square relative border border-black">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Link href="/" aria-label="Back to homepage" className="hover:opacity-60 transition-opacity mt-2">
                  <DrawerXIcon />
                </Link>
              </div>
              
              <div className="text-lg opacity-75 mb-6">
                {formatPrice(product.price, product.currency)}
              </div>
              
              <div className="mb-8">
                <p className="text-black">{product.description}</p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-medium mb-2">Purchase</h2>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.price}
                    className="w-fit p-3"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 