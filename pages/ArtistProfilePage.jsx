
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Loader2, ServerCrash, Building } from 'lucide-react';
import ArtistHeader from '@/components/artist/ArtistHeader';
import PortfolioGallery from '@/components/artist/PortfolioGallery';
import ArtistReviews from '@/components/artist/ArtistReviews';
import ContactBooking from '@/components/artist/ContactBooking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ArtistProfilePage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('artists')
          .select(`
            *,
            shop:shops (
              id,
              name,
              is_verified
            ),
            portfolio_pieces (
              id,
              title,
              image_url,
              before_image_url,
              description,
              category
            ),
            reviews (
              id,
              rating,
              comment,
              created_at,
              client:profiles (
                full_name,
                avatar_url
              )
            )
          `)
          .eq('id', id)
          .order('created_at', { foreignTable: 'reviews', ascending: false })
          .single();

        if (error) {
          throw error;
        }
        setArtist(data);
      } catch (err) {
        console.error("Error fetching artist profile:", err);
        setError('Could not load artist profile. They might not exist or there was a network issue.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <ServerCrash className="w-20 h-20 text-destructive mb-4" />
        <h1 className="text-3xl font-bold">Failed to Load Profile</h1>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Link to="/browse" className="mt-6">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Back to Browse</button>
        </Link>
      </div>
    );
  }

  if (!artist) return null;

  return (
    <>
      <Helmet>
        <title>{artist.name} - Tattoo Artist | Universal Inc</title>
        <meta name="description" content={artist.bio || `Portfolio and contact information for tattoo artist ${artist.name}. Specializing in ${artist.style}.`} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ArtistHeader artist={artist} />
        
        {artist.shop && (
          <div className="text-center -mt-8 mb-8">
            <Link to={`/shop/${artist.shop.id}`} className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
              <Building className="w-4 h-4" />
              <span>Works at <strong>{artist.shop.name}</strong></span>
            </Link>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({artist.reviews?.length || 0})</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio" className="mt-8">
              <PortfolioGallery portfolio={artist.portfolio_pieces} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-8">
              <ArtistReviews reviews={artist.reviews} artistId={artist.id} />
            </TabsContent>
            <TabsContent value="contact" className="mt-8">
              <ContactBooking artist={artist} />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </>
  );
};

export default ArtistProfilePage;
  