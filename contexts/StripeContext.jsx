
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext(null);

let stripePromise;

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const StripeProvider = ({ children }) => {
  const [stripe, setStripe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      const errorMessage = "Stripe Publishable Key is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY.";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    if (!stripePromise) {
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    
    stripePromise.then(setStripe).catch(stripeError => {
      console.error("Failed to load Stripe:", stripeError);
      setError("Failed to initialize Stripe. Payments will not be available.");
    });
  }, []);

  if (error) {
    console.error("Stripe Provider Error:", error);
  }

  return (
    <StripeContext.Provider value={stripe}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  return useContext(StripeContext);
};
