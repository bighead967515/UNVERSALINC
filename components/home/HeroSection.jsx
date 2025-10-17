import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const handlePostIdeaClick = () => {
    navigate('/signup');
  };

  return (
    <section className="relative overflow-hidden bg-background text-center py-20 md:py-32 rounded-xl shadow-lg">
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path fill="%23F2A64B" fill-opacity="0.1" d="M0 0h80v80H0zM20 20h40v40H20z"></path></svg>')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }} 
          className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 leading-tight"
        >
          <span className="gradient-text">Bring Your Tattoo</span> Ideas to Life
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }} 
          className="text-md md:text-lg lg:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
        >
          The easiest way to find and collaborate with talented tattoo artists. Post your dream tattoo concept and let the perfect artist find you.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }} 
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="text-lg py-7 px-8" onClick={handlePostIdeaClick}>
            <Sparkles className="mr-2 h-5 w-5" />
            Post Your Dream Tattoo
          </Button>
          <Button variant="outline" size="lg" className="text-lg py-7 px-8" onClick={() => navigate('/browse')}>
            <Search className="mr-2 h-5 w-5" />
            Find an Artist
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;