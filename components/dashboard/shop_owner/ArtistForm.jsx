import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const artistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  style: z.string().optional(),
  bio: z.string().optional(),
});

const ArtistForm = ({ artist, shopId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(artistSchema),
  });

  useEffect(() => {
    if (artist) {
      reset({
        name: artist.name,
        style: artist.style || '',
        bio: artist.bio || '',
      });
    } else {
      reset({
        name: '',
        style: '',
        bio: '',
      });
    }
  }, [artist, reset]);
  
  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    let error;
  
    if (artist) {
      // Update existing artist
      ({ error } = await supabase.from('artists').update(formData).eq('id', artist.id));
    } else {
      // Create new artist
      const newArtistData = {
        ...formData,
        shop_id: shopId,
        is_featured: false, // Default value
        rating: 0,
        reviews: 0,
      };
      ({ error } = await supabase.from('artists').insert(newArtistData));
    }
  
    if (error) {
      toast({ variant: 'destructive', title: 'Operation failed', description: error.message });
    } else {
      toast({ title: 'Success!', description: `Artist ${artist ? 'updated' : 'added'} successfully.` });
      onSuccess();
    }
  
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Artist Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="style">Primary Style</Label>
        <Input id="style" {...register('style')} />
        {errors.style && <p className="text-sm text-destructive">{errors.style.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" {...register('bio')} />
        {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {artist ? 'Save Changes' : 'Add Artist'}
      </Button>
    </form>
  );
};

export default ArtistForm;