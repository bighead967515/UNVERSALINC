import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Star, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required."),
  comment: z.string().min(10, "Comment must be at least 10 characters.").max(500, "Comment cannot exceed 500 characters."),
});

const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-8 h-8 cursor-pointer transition-colors ${
            (hoverRating || rating) >= star ? 'text-accent fill-accent' : 'text-gray-600'
          }`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ))}
    </div>
  );
};

const ArtistReviews = ({ artistId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const rating = watch('rating');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*, client:profiles(id, full_name, avatar_url)')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching reviews', description: error.message });
    } else {
      setReviews(data);
    }
    setLoading(false);
  }, [artistId, toast]);

  useEffect(() => {
    fetchReviews();
    register('rating');
  }, [fetchReviews, register]);

  const onSubmit = async (data) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in to leave a review.' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      artist_id: artistId,
      client_id: user.id,
      rating: data.rating,
      comment: data.comment,
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to submit review', description: error.message });
    } else {
      toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
      reset();
      fetchReviews();
    }
    setSubmitting(false);
  };
  
  return (
    <div className="py-12">
      <div className="grid md:grid-cols-5 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-3"
        >
          <h3 className="text-2xl font-bold mb-6 text-foreground">Client Reviews ({reviews.length})</h3>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 -mr-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-4">
                      {review.client?.avatar_url ? (
                        <img src={review.client.avatar_url} alt={review.client.full_name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-foreground">{review.client?.full_name || 'Anonymous'}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-gray-600'}`} />)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{format(new Date(review.created_at), "MMMM d, yyyy")}</p>
                      <p className="text-sm text-foreground/80">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">This artist doesn't have any reviews yet.</p>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
           <div className="bg-card p-8 rounded-xl sticky top-28 border border-border shadow-lg">
            <h3 className="text-2xl font-bold mb-2 text-foreground">Leave a Review</h3>
            {user ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label className="text-muted-foreground mb-2 block">Your Rating</Label>
                  <StarRating rating={rating} onRatingChange={(newRating) => setValue('rating', newRating, { shouldValidate: true })} />
                  {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>}
                </div>
                <div>
                  <Label htmlFor="comment" className="text-muted-foreground">Your Comment</Label>
                  <Textarea id="comment" {...register("comment")} placeholder="Share your experience..." className="bg-background border-border mt-1" rows={4} />
                  {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>}
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Review
                </Button>
              </form>
            ) : (
              <p className="text-center text-muted-foreground">Please <a href="/login" className="text-primary underline">log in</a> to leave a review.</p>
            )}
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArtistReviews;