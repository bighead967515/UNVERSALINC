import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Sparkles, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DreamTattooForm from '@/components/home/DreamTattooForm';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const stylesData = [
  { name: "All Styles", slug: "all" },
  { name: "Watercolor", slug: "watercolor" },
  { name: "Realism", slug: "realism" },
  { name: "Neo-Traditional", slug: "neo-traditional" },
  { name: "Japanese", slug: "japanese" },
  { name: "Blackwork", slug: "blackwork" },
  { name: "Fine Line", slug: "fine-line" },
  { name: "Tribal", slug: "tribal" },
  { name: "Geometric", slug: "geometric" },
];

const bodyPartsData = [
    { name: "All Body Parts", slug: "all" },
    { name: "Arm", slug: "arm" },
    { name: "Back", slug: "back" },
    { name: "Leg", slug: "leg" },
    { name: "Chest", slug: "chest" },
    { name: "Shoulder", slug: "shoulder" },
    { name: "Hand", slug: "hand" },
    { name: "Foot", slug: "foot" },
];

const GalleryPage = () => {
  const [styleFilter, setStyleFilter] = useState('all');
  const [bodyPartFilter, setBodyPartFilter] = useState('all');
  const [artistFilter, setArtistFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [inspirationImage, setInspirationImage] = useState(null);
  const [portfolioPieces, setPortfolioPieces] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [savingFavorites, setSavingFavorites] = useState(new Set());

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchArtists = useCallback(async () => {
    const { data, error } = await supabase
      .from('artists')
      .select('id, name')
      .order('name', { ascending: true });
    if (error) {
      console.error('Error fetching artists:', error);
    } else {
      setArtists(data);
    }
  }, []);

  const fetchPortfolioPieces = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('portfolio_pieces')
      .select(`
        id,
        title,
        image_url,
        category,
        description,
        artists ( id, name )
      `)
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50);

    if (styleFilter !== 'all') {
      query = query.ilike('category', `%${styleFilter}%`);
    }
    if (bodyPartFilter !== 'all') {
      query = query.ilike('description', `%${bodyPartFilter}%`);
    }
    if (artistFilter !== 'all') {
      query = query.eq('artist_id', artistFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching portfolio pieces:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch gallery images.' });
    } else {
      setPortfolioPieces(data);
    }
    setLoading(false);
  }, [styleFilter, bodyPartFilter, artistFilter, toast]);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('favorite_tattoos')
      .select('portfolio_piece_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites(new Set(data.map(fav => fav.portfolio_piece_id)));
    }
  }, [user]);

  useEffect(() => {
    fetchArtists();
    fetchPortfolioPieces();
  }, [fetchArtists, fetchPortfolioPieces]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleUseAsInspiration = (piece) => {
    setInspirationImage(piece.image_url);
    setIsFormOpen(true);
  };

  const handleToggleFavorite = async (pieceId) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to save your favorite tattoos.',
      });
      navigate('/login');
      return;
    }

    setSavingFavorites(prev => new Set(prev).add(pieceId));

    const isFavorited = favorites.has(pieceId);
    if (isFavorited) {
      const { error } = await supabase
        .from('favorite_tattoos')
        .delete()
        .match({ user_id: user.id, portfolio_piece_id: pieceId });
      
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not remove from favorites.' });
      } else {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(pieceId);
          return newFavorites;
        });
        toast({ title: 'Removed from favorites!' });
      }
    } else {
      const { error } = await supabase
        .from('favorite_tattoos')
        .insert({ user_id: user.id, portfolio_piece_id: pieceId });

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add to favorites.' });
      } else {
        setFavorites(prev => new Set(prev).add(pieceId));
        toast({ title: 'Added to favorites!' });
      }
    }
    setSavingFavorites(prev => {
      const newSaving = new Set(prev);
      newSaving.delete(pieceId);
      return newSaving;
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setInspirationImage(null);
  };
  
  const handleSuccess = () => {
    handleFormClose();
    navigate('/dream-tattoo');
  }

  return (
    <>
      <Helmet>
        <title>Inspiration Gallery - Universal Inc</title>
        <meta name="description" content="Explore a gallery of amazing tattoos. Filter by style and find the perfect inspiration for your next piece of body art." />
      </Helmet>

      <DreamTattooForm 
        isOpen={isFormOpen} 
        onClose={handleFormClose} 
        onPostSuccess={handleSuccess}
        inspirationUrl={inspirationImage}
      />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4">Inspiration <span className="gradient-text">Gallery</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Find the perfect design. Browse thousands of tattoos by style and get inspired for your next piece.</p>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by style" />
            </SelectTrigger>
            <SelectContent>
              {stylesData.map(style => (
                <SelectItem key={style.slug} value={style.slug}>{style.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={bodyPartFilter} onValueChange={setBodyPartFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by body part" />
            </SelectTrigger>
            <SelectContent>
              {bodyPartsData.map(part => (
                <SelectItem key={part.slug} value={part.slug}>{part.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={artistFilter} onValueChange={setArtistFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by artist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Artists</SelectItem>
              {artists.map(artist => (
                <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {portfolioPieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden group art-card h-full flex flex-col">
                  <div className="relative aspect-square">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      alt={piece.title || 'Tattoo portfolio piece'} src="https://images.unsplash.com/photo-1521308452854-e037c0062a1e" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="flex justify-between items-center">
                        <Button onClick={() => handleUseAsInspiration(piece)} size="sm">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Inspire
                        </Button>
                        <Button 
                          onClick={() => handleToggleFavorite(piece.id)} 
                          variant="ghost" 
                          size="icon"
                          disabled={savingFavorites.has(piece.id)}
                          className="text-white hover:text-primary"
                        >
                          {savingFavorites.has(piece.id) ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Heart className={`h-5 w-5 transition-colors ${favorites.has(piece.id) ? 'text-red-500 fill-current' : ''}`} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm truncate">{piece.title}</p>
                    <p className="text-xs text-muted-foreground">by {piece.artists?.name || 'Unknown Artist'}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        { !loading && portfolioPieces.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No tattoos found for the selected filters.</p>
                <p>Try adjusting your search!</p>
            </div>
        )}
      </div>
    </>
  );
};

export default GalleryPage;