import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ServerCrash } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import ArtistCard from '@/components/browse/ArtistCard';
import { Button } from '@/components/ui/button';

const ARTISTS_PER_PAGE = 8;

const ArtistGrid = ({ filters }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchArtists = useCallback(async (currentPage, currentFilters) => {
    let query = supabase
      .from('artists')
      .select(`
        *,
        portfolio_pieces (
          id,
          title,
          image_url
        )
      `, { count: 'exact' });

    if (currentFilters.style) {
      query = query.ilike('style', `%${currentFilters.style}%`);
    }
    if (currentFilters.rating > 0) {
      query = query.gte('rating', currentFilters.rating);
    }
    if (currentFilters.verifiedOnly) {
      query = query.eq('verified', true);
    }
    if (currentFilters.location) {
      query = query.ilike('location', `%${currentFilters.location}%`);
    }

    if (currentFilters.sortBy === 'rating') {
        query = query.order('rating', { ascending: false, nullsFirst: false });
    } else if (currentFilters.sortBy === 'reviews') {
        query = query.order('reviews', { ascending: false, nullsFirst: false });
    }
    
    const from = currentPage * ARTISTS_PER_PAGE;
    const to = from + ARTISTS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }
    
    return { data, count };
  }, []);

  useEffect(() => {
    const loadInitialArtists = async () => {
      setLoading(true);
      setError(null);
      setPage(0);
      try {
        const { data, count } = await fetchArtists(0, filters);
        setArtists(data);
        setTotalCount(count);
        setHasMore(data.length < count);
      } catch (err) {
        setError("Failed to fetch artists. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    const debounceTimeout = setTimeout(() => {
      loadInitialArtists();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [filters, fetchArtists]);

  const loadMoreArtists = async () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const { data } = await fetchArtists(nextPage, filters);
      setArtists(prev => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(artists.length + data.length < totalCount);
    } catch (err) {
      setError("Failed to load more artists.");
    } finally {
      setLoadingMore(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#FF5722]" />
        <p className="text-lg text-muted-foreground mt-4">Finding the best artists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-center">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-center">
        <h3 className="text-2xl font-bold text-white mb-2">No Artists Found</h3>
        <p className="text-muted-foreground">Try adjusting your filters to find more artists.</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >
        {artists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </motion.div>
      <AnimatePresence>
        {hasMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center mt-12"
          >
            <Button
              onClick={loadMoreArtists}
              disabled={loadingMore}
              className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-8 py-3 text-lg"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Artists'
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtistGrid;