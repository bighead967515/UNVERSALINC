import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import HeroSection from '@/components/home/HeroSection';
import DreamBoardSection from '@/components/home/DreamBoardSection';
import FeaturedArtistsSection from '@/components/home/FeaturedArtistsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import PopularStylesSection from '@/components/home/PopularStylesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import DreamTattooForm from '@/components/home/DreamTattooForm';
import CoverUpGallerySection from '@/components/home/CoverUpGallerySection';

const HomePage = () => {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [dreamTattoos, setDreamTattoos] = useState([]);
  const [coverUpPosts, setCoverUpPosts] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingTattoos, setLoadingTattoos] = useState(true);
  const [loadingCoverUps, setLoadingCoverUps] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchHomePageData = useCallback(async () => {
    setLoadingArtists(true);
    setLoadingTattoos(true);
    setLoadingCoverUps(true);

    const artistsPromise = supabase
      .from('artists')
      .select('*, shop:shops(name)')
      .eq('is_featured', true)
      .order('rating', { ascending: false, nulls: 'last' })
      .limit(4);

    const tattoosPromise = supabase
      .from('tattoo_requests')
      .select('*, client:profiles(full_name, avatar_url)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(4);

    const coverUpsPromise = supabase
      .from('cover_up_posts')
      .select('*, client:profiles(full_name, avatar_url)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(4);

    const [
        { data: artistsData, error: artistsError }, 
        { data: tattoosData, error: tattoosError },
        { data: coverUpsData, error: coverUpsError }
    ] = await Promise.all([artistsPromise, tattoosPromise, coverUpsPromise]);

    if (artistsError) {
      toast({ variant: "destructive", title: "Failed to load featured artists." });
    } else {
      setFeaturedArtists(artistsData);
    }
    setLoadingArtists(false);

    if (tattoosError) {
      toast({ variant: "destructive", title: "Failed to load dream tattoos." });
    } else {
      setDreamTattoos(tattoosData);
    }
    setLoadingTattoos(false);
    
    if (coverUpsError) {
      toast({ variant: "destructive", title: "Failed to load cover-up posts." });
    } else {
      setCoverUpPosts(coverUpsData);
    }
    setLoadingCoverUps(false);

  }, []);

  useEffect(() => {
    fetchHomePageData();
  }, [fetchHomePageData]);

  return (
    <>
      <Helmet>
        <title>Universal Inc // Bring Your Tattoo Ideas to Life</title>
        <meta name="description" content="Collaborate with the best tattoo artists. Post your tattoo idea and receive proposals from talented artists ready to bring your vision to reality." />
      </Helmet>

      <DreamTattooForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onPostSuccess={fetchHomePageData} 
      />

      <div className="container mx-auto px-4 py-8 space-y-24">
        <HeroSection />
        <HowItWorksSection />
        <FeaturedArtistsSection 
          artists={featuredArtists}
          loading={loadingArtists}
        />
        <DreamBoardSection 
          dreamTattoos={dreamTattoos}
          loading={loadingTattoos}
          onPostDreamTattoo={() => setIsFormOpen(true)}
        />
        <PopularStylesSection />
        <WhyChooseUsSection />
        <CoverUpGallerySection 
            posts={coverUpPosts}
            loading={loadingCoverUps}
        />
      </div>
    </>
  );
};

export default HomePage;