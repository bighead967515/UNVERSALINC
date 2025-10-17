import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, MapPin, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FeaturedArtistsSection = ({ artists, loading }) => {
  return (
    <section>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl lg:text-6xl mb-4">Featured <span className="gradient-text">Artists</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Meet some of the top-rated and most sought-after artists on our platform.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {artists.map((artist, index) => (
              <motion.div key={artist.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Card className="art-card overflow-hidden group h-full flex flex-col">
                  <div className="relative">
                    <img  className="w-full h-56 object-cover" alt={`${artist.name} - Tattoo Artist`} src="https://images.unsplash.com/photo-1625053224167-22362965b56f" />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-4 h-4 text-primary fill-current" />
                      <span className="text-white text-sm font-bold">{artist.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-primary">
                            <AvatarImage src={artist.image_url} alt={artist.name}/>
                            <AvatarFallback>{artist.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-bold flex items-center">{artist.name} {artist.verified && <ShieldCheck className="w-5 h-5 ml-2 text-primary" />}</h3>
                            <p className="text-sm text-muted-foreground">{artist.style || "Versatile Artist"}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 flex-grow line-clamp-2">{artist.bio}</p>
                     <div className="flex items-center space-x-2 text-muted-foreground text-sm my-3">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{artist.location || artist.shop?.name || 'Location Not Set'}</span>
                      </div>
                      <Button asChild className="w-full font-medium mt-auto">
                        <Link to={`/artist/${artist.id}`}>View Profile</Link>
                      </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/browse">
              Browse All Artists<ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedArtistsSection;