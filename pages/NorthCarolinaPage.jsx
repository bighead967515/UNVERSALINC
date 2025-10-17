import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Loader2, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NorthCarolinaPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .ilike('location', '%NC%');

      if (error) {
        toast({
          variant: "destructive",
          title: "Failed to load artists.",
          description: "There was an issue connecting to the network."
        });
        console.error("Error fetching artists:", error);
      } else {
        setArtists(data);
      }
      setLoading(false);
    };

    fetchArtists();
  }, []);

  return (
    <>
      <Helmet>
        <title>North Carolina Tattoo Artists - InkConnect</title>
        <meta name="description" content="Discover the best tattoo artists and studios in North Carolina. From Charlotte to Raleigh, find your perfect artist on InkConnect." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-background text-foreground"
      >
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
              North Carolina's <span className="gradient-text">Tar Heel Ink</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-mono">
              Explore top-rated tattoo studios and artists from across the Tar Heel State.
            </p>
          </div>

          <div className="mt-20">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="cyber-card">
                      <div className="cyber-card-content">
                        <div className="relative mb-4">
                          <img  class="w-full h-64 object-cover" alt={`${artist.name} - Tattoo Artist`} style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 90%)` }} src="https://images.unsplash.com/photo-1697779139537-89de7bed8f6c" />
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 flex items-center space-x-1">
                            <Star className="w-4 h-4 text-primary fill-current" />
                            <span className="text-white text-sm font-bold">{artist.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-2xl mb-1">{artist.name}</h3>
                        <p className="text-muted-foreground font-mono text-sm mb-2">{artist.studio_name}</p>
                        <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-4 font-mono">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <span>{artist.location}</span>
                        </div>
                        <Link to={`/artist/${artist.id}`}>
                          <Button className="w-full font-medium">View Profile</Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default NorthCarolinaPage;