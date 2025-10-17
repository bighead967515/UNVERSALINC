import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const DreamBoardSection = ({ dreamTattoos, loading, onPostDreamTattoo }) => {
  const navigate = useNavigate();

  const handlePostDreamTattoo = () => {
    navigate('/signup');
  };

  return (
    <section className="bg-card py-12 rounded-xl shadow-lg">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
        <h2 className="text-4xl lg:text-5xl mb-4">The <span className="gradient-text">Dream Board</span></h2>
        <p className="text-md text-muted-foreground max-w-xl mx-auto">Latest tattoo ideas from clients. Artists, find your next masterpiece!</p>
        <Button size="lg" className="mt-6" onClick={handlePostDreamTattoo}>
          <Sparkles className="mr-2 w-5 h-5" />
          Post Your Dream Tattoo
        </Button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
      ) : dreamTattoos.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4 px-4">
          {dreamTattoos.map((tattoo, index) => (
            <motion.div key={tattoo.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card className="art-card h-full flex flex-col">
                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={tattoo.client?.avatar_url} />
                      <AvatarFallback>{tattoo.client?.full_name?.charAt(0) || 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{tattoo.client?.full_name || 'A Client'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tattoo.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-foreground truncate">{tattoo.title}</h3>
                  <p className="text-sm text-muted-foreground flex-grow line-clamp-3">{tattoo.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tattoo.style_tags?.slice(0, 2).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No dream tattoos posted yet. Be the first!</p>
      )}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center mt-8">
        <Link to="/dream-tattoo">
          <Button variant="outline" size="lg">
            View All Ideas<ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default DreamBoardSection;