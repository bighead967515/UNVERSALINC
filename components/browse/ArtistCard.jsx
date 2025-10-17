import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ArtistCard = ({ artist }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const portfolioImages = artist.portfolio_pieces || [];

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Card className="artist-card flex flex-col h-full overflow-hidden bg-card border-transparent">
        <div className="relative">
          <div className="grid grid-cols-3 grid-rows-2 h-48">
            <div className="col-span-2 row-span-2">
              {portfolioImages.length > 0 ? (
                <img 
                  className="w-full h-full object-cover" 
                  alt={portfolioImages[0].title} 
                 src={portfolioImages[0].image_url} />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No Portfolio</span>
                </div>
              )}
            </div>
            <div className="col-span-1">
              {portfolioImages.length > 1 ? (
                <img 
                  className="w-full h-full object-cover" 
                  alt={portfolioImages[1].title} 
                 src={portfolioImages[1].image_url} />
              ) : (
                <div className="w-full h-full bg-muted/80"></div>
              )}
            </div>
            <div className="col-span-1">
              {portfolioImages.length > 2 ? (
                <img 
                  className="w-full h-full object-cover" 
                  alt={portfolioImages[2].title} 
                 src={portfolioImages[2].image_url} />
              ) : (
                <div className="w-full h-full bg-muted/60"></div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <img 
              className="w-20 h-20 rounded-full object-cover border-4 border-primary"
              alt={`${artist.name} profile photo`}
             src={artist.image_url || `https://ui-avatars.com/api/?name=${artist.name}&background=0D8ABC&color=fff`} />
          </div>
        </div>
        <CardContent className="pt-14 text-center flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white">{artist.name}</h3>
            <p className="text-sm text-primary font-medium mb-2">{artist.style}</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{artist.location || 'Not specified'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-accent fill-current" />
                <span className="font-semibold text-white">{artist.rating || 'N/A'}</span>
                <span>({artist.reviews || 0})</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link to={`/artist/${artist.id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                View Portfolio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ArtistCard;