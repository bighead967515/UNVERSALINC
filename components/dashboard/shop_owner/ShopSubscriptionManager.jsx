import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Free Tier',
    id: 'free',
    title: 'The Listing',
    price: '$0/month',
    features: [
      { text: 'Claimable Shop Profile', included: true },
      { text: 'Edit Basic Info (Address, Hours)', included: true },
      { text: 'Up to 3 Resident Artists Listed', included: true },
      { text: 'Up to 10 Portfolio Photos', included: true },
      { text: 'Basic Contact Form (with platform branding)', included: true },
      { text: '"Verified Shop" Badge', included: false },
      { text: 'Direct Booking / Calendar Integration', included: false },
      { text: 'Post "Flash Tattoos" & Events', included: false },
      { text: 'Boosted Search Ranking', included: false },
      { text: 'Appear on Homepage "Featured Shops"', included: false },
    ],
    isCurrent: false,
  },
  {
    name: 'Starter Tier',
    id: 'starter',
    title: 'The Professional',
    price: '~$29/month',
    features: [
      { text: '"Verified Shop" Badge', included: true },
      { text: 'Up to 10 Resident Artists Listed', included: true },
      { text: 'Up to 50 Portfolio Photos', included: true },
      { text: 'Contact Form (no branding)', included: true },
      { text: 'Post 1 "Flash Tattoo" or Event per month', included: true },
      { text: 'No Competitor Ads on Your Profile', included: true },
      { text: 'Basic Analytics (Profile Views)', included: true },
      { text: 'Email Support', included: true },
      { text: 'Direct Booking / Calendar Integration', included: false },
      { text: 'Boosted Search Ranking', included: false },
    ],
    isCurrent: false,
  },
  {
    name: 'Pro Tier',
    id: 'pro',
    title: 'The Business Builder',
    price: '~$59/month',
    isMostPopular: true,
    features: [
      { text: 'All Starter features, plus:', included: true, isHeader: true },
      { text: 'Unlimited Resident Artists Listed', included: true },
      { text: 'Unlimited Portfolio Photos', included: true },
      { text: 'Direct Booking / Calendar Integration', included: true },
      { text: 'Up to 5 "Flash Tattoos" or Events per month', included: true },
      { text: 'Direct Messaging with Clients', included: true },
      { text: 'Boosted Search Ranking', included: true },
      { text: 'Appear on Homepage "Featured Shops" (Rotational)', included: true },
      { text: 'Advanced Analytics (Lead Clicks, Demographics)', included: true },
      { text: 'Priority Email Support', included: true },
    ],
    isCurrent: false,
  },
  {
    name: 'Elite Tier',
    id: 'elite',
    title: 'The Market Leader',
    price: '~$99+/month',
    features: [
      { text: 'All Pro features, plus:', included: true, isHeader: true },
      { text: 'Portfolio Video Support', included: true },
      { text: 'Unlimited "Flash Tattoos" & Events', included: true },
      { text: 'Top-Tier Search Ranking', included: true },
      { text: 'Guaranteed Homepage "Featured Shops" Placement', included: true },
      { text: 'Priority Phone & Email Support', included: true },
      { text: 'Multi-Location Management', included: true },
    ],
    isCurrent: false,
  },
];

const ShopSubscriptionManager = () => {
  const { shop } = useOutletContext();

  const handleSelectPlan = (tierId) => {
    toast({
      title: 'Feature Not Implemented',
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  if (!shop) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const currentTierId = shop?.subscription_tier || 'free';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Subscription Plans</h2>
        <p className="text-muted-foreground mt-2">Choose the plan that's right for your shop's growth.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
        {tiers.map((tier) => (
          <Card key={tier.id} className={cn(
            "flex flex-col h-full",
            currentTierId === tier.id ? 'border-primary ring-2 ring-primary' : '',
            tier.isMostPopular ? 'border-secondary ring-2 ring-secondary' : ''
          )}>
            {tier.isMostPopular && (
              <div className="absolute -top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 text-sm font-bold rounded-full flex items-center gap-1">
                <Star className="w-4 h-4" /> Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{tier.title}</CardTitle>
              <CardDescription>{tier.name}</CardDescription>
              <p className="text-4xl font-bold pt-4">{tier.price}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className={cn("flex items-start gap-3", feature.isHeader && "font-bold mt-4")}>
                    {!feature.isHeader && (
                      feature.included ? 
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /> : 
                      <XCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <span className={cn(!feature.included && "text-muted-foreground")}>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {currentTierId === tier.id ? (
                <Button disabled className="w-full">Current Plan</Button>
              ) : (
                <Button onClick={() => handleSelectPlan(tier.id)} className="w-full" variant={tier.isMostPopular ? 'secondary' : 'default'}>
                  {currentTierId === 'free' ? 'Upgrade' : 'Change Plan'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopSubscriptionManager;