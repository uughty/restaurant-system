import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Ensure environment variable exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',

});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { amount, currency = 'usd' } = req.body;

    // ✅ Validate amount
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({
        error: 'Invalid amount. Must be a number in cents.',
      });
    }

    // Stripe expects the smallest currency unit (e.g., cents)
    if (amount < 50) {
      return res.status(400).json({
        error: 'Amount must be at least 50 cents.',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error('Stripe Error:', err);

    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal Server Error',
    });
  }
}
