import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle, Heart, Share2, Instagram, Facebook, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ArtistHeader = ({ artist }) => {
  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `The ${feature} feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
    });
  };

  const socialIcons = {
    instagram: <Instagram className="w-5 h-5" />,
    facebook: <Facebook className="w-5 h-5" />,
    website: <Globe className="w-5 h-5" />,
  };

  return (
    <>
      <div className="relative h-64 md:h-80 w-full">
        <img 
          className="w-full h-full object-cover"
          alt={`${artist.name}'s tattoo studio banner`}
          src={artist.cover_image_url} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-24 md:-mt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl p-6 shadow-2xl border border-border"
        >
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative -mt-20 md:-mt-24">
              <img 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary shadow-lg"
                alt={`${artist.name} profile photo`}
                src={artist.image_url} />
              {artist.verified && (
                <div className="absolute bottom-1 right-1 bg-gradient-to-br from-primary to-secondary rounded-full p-2 shadow-md">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{artist.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{artist.studio_name || 'Independent Artist'}</p>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-muted-foreground mt-2">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{artist.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-accent fill-current" />
                  <span className="font-semibold text-foreground">{artist.rating}</span>
                  <span>({artist.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {artist.social_links && Object.entries(artist.social_links).map(([key, value]) => value && (
                <motion.a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, color: 'hsl(var(--primary))' }}
                  className="text-muted-foreground transition-colors"
                >
                  {socialIcons[key]}
                </motion.a>
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFeatureClick('favorite')}
                className="text-foreground hover:text-primary hover:bg-muted rounded-full"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFeatureClick('share')}
                className="text-foreground hover:text-primary hover:bg-muted rounded-full"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">About Me</h2>
            <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ArtistHeader;