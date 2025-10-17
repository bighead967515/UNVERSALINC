import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const shopSchema = z.object({
  name: z.string().min(3, 'Shop name must be at least 3 characters'),
  address: z.string().min(5, 'Address is required'),
  phone_number: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
});

const ShopInfoManager = () => {
  const { shop } = useOutletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(shopSchema),
  });

  useEffect(() => {
    if (shop) {
      reset(shop);
    }
  }, [shop, reset]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from('shops')
      .update(formData)
      .eq('id', shop.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error updating shop', description: error.message });
    } else {
      toast({ title: 'Shop Updated!', description: 'Your shop information has been successfully updated.' });
    }
    setIsSubmitting(false);
  };

  if (!shop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading shop information or no shop found to manage.</p>
          <p className="text-sm text-muted-foreground">If you believe this is an error, please contact support.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Your Shop</CardTitle>
        <CardDescription>Update your shop's public information here.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Shop Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" {...register('phone_number')} placeholder="e.g. (555) 123-4567" />
            {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...register('website')} placeholder="https://example.com" />
            {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={5} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShopInfoManager;