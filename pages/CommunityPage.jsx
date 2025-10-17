import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rss, MessageCircle, Mic, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const CommunityPage = () => {
  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon",
      description: `The ${feature} section is currently under construction. Please check back later.`,
      variant: 'cyber'
    });
  };

  return (
    <>
      <Helmet>
        <title>Community - Universal Inc</title>
        <meta name="description" content="Join the Universal Inc community. Participate in forums, discover events, and connect with other tattoo enthusiasts." />
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
              Our <span className="gradient-text">Community</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-mono">
              This is the central hub for the Universal Inc community. Get involved, share your art, and connect with others.
            </p>
          </div>

          <div className="mt-20 max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card p-8 border-2 border-border cyber-glow-soft flex flex-col items-center"
              style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}
            >
              <MessageCircle className="w-16 h-16 text-primary mb-4" />
              <h3 className="text-2xl mb-2">Forums</h3>
              <p className="font-mono text-muted-foreground flex-grow mb-6">Discuss styles, aftercare, and find inspiration.</p>
              <Button variant="outline" onClick={() => handleFeatureClick('Forums')}>Join Discussion</Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card p-8 border-2 border-border cyber-glow-soft flex flex-col items-center"
              style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}
            >
              <Users className="w-16 h-16 text-green-400 mb-4" />
              <h3 className="text-2xl mb-2">Artists</h3>
              <p className="font-mono text-muted-foreground flex-grow mb-6">Discover talented artists from around the world.</p>
              <Link to="/browse"><Button variant="outline">Browse Artists</Button></Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card p-8 border-2 border-border cyber-glow-soft flex flex-col items-center"
              style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}
            >
              <Rss className="w-16 h-16 text-secondary mb-4" />
              <h3 className="text-2xl mb-2">Blog</h3>
              <p className="font-mono text-muted-foreground flex-grow mb-6">Artist interviews, studio spotlights, and industry news.</p>
              <Button variant="outline" onClick={() => handleFeatureClick('Blog')}>Read More</Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card p-8 border-2 border-border cyber-glow-soft flex flex-col items-center"
              style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}
            >
              <Mic className="w-16 h-16 text-accent mb-4" />
              <h3 className="text-2xl mb-2">Events</h3>
              <p className="font-mono text-muted-foreground flex-grow mb-6">Find tattoo conventions, guest spots, and workshops.</p>
              <Button variant="outline" onClick={() => handleFeatureClick('Events')}>View Schedule</Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CommunityPage;