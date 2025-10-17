import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, ServerCrash, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ShopCard = ({ shop, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div variants={cardVariants} className="bg-[#262626] rounded-2xl overflow-hidden shadow-lg hover-glow flex flex-col">
      <img 
        className="w-full h-48 object-cover"
        alt={`${shop.name} exterior or interior`}
        src={shop.cover_image_url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800'}
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-white mb-2">{shop.name}</h3>
        <p className="text-sm text-[#FF5722] font-semibold mb-3">{shop.style}</p>
        <p className="text-[#A3A3A3] text-sm mb-4 flex-grow">{shop.bio}</p>
        
        <div className="flex items-center justify-between text-sm text-[#A3A3A3] mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF5722]" />
            <span>{shop.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-semibold text-white">{shop.rating}</span>
            <span className="text-xs">({shop.reviews} reviews)</span>
          </div>
        </div>

        <Link to={`/artist/${shop.id}`} className="mt-auto">
          <Button className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold">
            View Profile
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const LosAngelesPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .or('location.ilike.%Los Angeles%,location.ilike.%Long Beach%,location.ilike.%Venice%,location.ilike.%Hollywood%,location.ilike.%Studio City%')
        .order('rating', { ascending: false });

      if (error) {
        console.error("Error fetching LA shops:", error);
        setError("Could not fetch the best shops in LA. Please try again later.");
      } else {
        setShops(data);
      }
      setLoading(false);
    };

    fetchShops();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Best Tattoo Shops in Los Angeles | InkConnect</title>
        <meta name="description" content="Discover the top-rated and most iconic tattoo shops in Los Angeles, from historic parlors to modern studios." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#1A1A1A] pt-8 pb-16"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              The Best of <span className="gradient-text">Los Angeles</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A curated list of the most iconic and highly-rated tattoo shops in the City of Angels, based on Modern Luxury's 2024 guide.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col justify-center items-center min-h-[50vh]">
              <Loader2 className="w-12 h-12 animate-spin text-[#FF5722]" />
              <p className="text-lg text-muted-foreground mt-4">Curating the LA Scene...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center min-h-[50vh] text-center">
              <ServerCrash className="w-16 h-16 text-destructive mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {shops.map((shop, index) => (
                <ShopCard key={shop.id} shop={shop} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default LosAngelesPage;