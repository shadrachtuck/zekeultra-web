import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/prismic';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

function formatDeliveryEstimate(estimate) {
  if (!estimate) return null;

  const unitLabel = (unit, n) => {
    if (unit === 'business_day') return n === 1 ? 'business day' : 'business days';
    if (unit === 'day') return n === 1 ? 'day' : 'days';
    if (unit === 'hour') return n === 1 ? 'hour' : 'hours';
    if (unit === 'week') return n === 1 ? 'week' : 'weeks';
    if (unit === 'month') return n === 1 ? 'month' : 'months';
    return unit;
  };

  const min = estimate.minimum;
  const max = estimate.maximum;

  if (min && max) {
    if (min.value === max.value) {
      return `${min.value} ${unitLabel(max.unit, max.value)}`;
    }
    return `${min.value}-${max.value} ${unitLabel(max.unit, max.value)}`;
  }
  if (max) return `up to ${max.value} ${unitLabel(max.unit, max.value)}`;
  if (min) return `${min.value}+ ${unitLabel(min.unit, min.value)}`;
  return null;
}

export async function GET() {
  try {
    const client = createClient();
    const siteSettings = await client.getSingle('site_settings');
    const stripeApiKey = siteSettings?.data?.stripe_private_api_key;

    if (!stripeApiKey) {
      return NextResponse.json({ rates: [] });
    }

    const stripe = new Stripe(stripeApiKey, {
      apiVersion: '2024-12-18.acacia',
    });

    const shippingRates = await stripe.shippingRates.list({
      active: true,
      limit: 20,
    });

    const rates = shippingRates.data
      .filter((rate) => rate.type === 'fixed_amount' && rate.fixed_amount?.amount != null)
      .map((rate) => ({
        id: rate.id,
        name: rate.display_name,
        price: rate.fixed_amount.amount,
        currency: rate.fixed_amount.currency,
        days: formatDeliveryEstimate(rate.delivery_estimate),
      }));

    return NextResponse.json({ rates });
  } catch (error) {
    console.error('Error fetching Stripe shipping rates:', error);
    return NextResponse.json({ rates: [] });
  }
}
