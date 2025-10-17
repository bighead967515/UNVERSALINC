import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Image as ImageIcon, ArrowRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CoverUpGallerySection = ({ posts, loading }) => {
  const navigate = useNavigate();

  const handlePostCoverUp = () => {
    navigate('/signup');
  };

  return (
    <section className="bg-card py-12 rounded-xl shadow-lg">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <h2 className="text-4xl lg:text-5xl mb-4"><span className="gradient-text">Cover-Up</span> Gallery</h2>
          <p className="text-md text-muted-foreground max-w-xl mx-auto">Latest tattoos clients are looking to cover. Find your next masterpiece!</p>
          <Button size="lg" className="mt-6" onClick={handlePostCoverUp}>
            <PlusCircle className="mr-2 w-5 h-5" />
            Post a Cover-Up Request
          </Button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {posts.map((post, index) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="art-card h-full flex flex-col group">
                  <div className="overflow-hidden rounded-t-lg">
                    <img src={post.image_url} alt="Tattoo to be covered" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <p className="text-sm text-muted-foreground flex-grow line-clamp-2 italic">"{post.description || 'No description provided.'}"</p>
                    <div className="flex items-center gap-3 mt-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={post.client?.avatar_url} />
                        <AvatarFallback>{post.client?.full_name?.charAt(0) || 'C'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{post.client?.full_name || 'A Client'}</p>
                        <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No cover-up requests posted yet.</p>
          </div>
        )}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center mt-8">
          <Link to="/cover-up-posts">
            <Button variant="outline" size="lg">
              View Full Gallery<ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CoverUpGallerySection;