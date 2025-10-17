import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Gem } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArtistSubscription = () => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: 'Subscription Info',
      description: "Artist subscriptions are now managed by your shop. Please contact your shop owner for details.",
    });
  }, [toast]);
  
  const handleManageSubscription = () => {
     toast({
      title: 'Redirecting to billing portal...',
      description: 'Stripe integration is required to complete this step.',
    });
  }

  return (
    <div>
      <h1 className="text-4xl font-black mb-2">My <span className="gradient-text">Subscription</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Your subscription details are managed by your shop.</p>

      <Card className="art-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Gem className="w-7 h-7 text-primary" />
            Shop-Managed Subscription
          </CardTitle>
          <CardDescription>
            Your access to features is determined by your shop's subscription plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-xl font-bold capitalize text-foreground">Managed by your Shop</p>
            <p className="text-muted-foreground mt-2">
              For details about your current features and any upgrades, please refer to your shop's owner.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <Link to="/pricing">
                <Button variant="outline">View All Plans</Button>
            </Link>
             <Button onClick={handleManageSubscription}>Manage Billing</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArtistSubscription;