import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const ClientReviews = () => {
  const reviews = [
    { artist: 'Pixel Pirate', rating: 5, comment: 'Amazing work, exactly what I wanted. The studio was clean and professional. Highly recommend!', date: 'May 15, 2025' },
    { artist: 'Synth Samurai', rating: 4, comment: 'Great artist, very talented. The session took a bit longer than expected but the result was worth it.', date: 'March 22, 2025' },
  ];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-primary fill-current' : 'text-muted-foreground'}`} />
    ));
  };

  return (
    <div>
      <h1 className="text-4xl font-black mb-2">My <span className="gradient-text">Reviews</span></h1>
      <p className="text-muted-foreground font-mono mb-8">A history of the feedback you've provided to artists.</p>

      <div className="space-y-6">
        {reviews.map((review, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">For: {review.artist}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{review.date}</p>
                </div>
                <div className="flex items-center">{renderStars(review.rating)}</div>
              </div>
              <p className="mt-4 text-muted-foreground font-mono italic">"{review.comment}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientReviews;