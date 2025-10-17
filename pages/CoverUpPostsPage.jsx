import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CoverUpPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cover_up_posts')
        .select(`
          *,
          client:profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cover-up posts:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load posts',
          description: error.message,
        });
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Cover-Up Ideas | InkConnect</title>
        <meta name="description" content="Browse through a gallery of tattoos clients want to cover up. Find your next cover-up project or get inspiration." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-5xl font-black mb-2">Cover-Up <span className="gradient-text">Gallery</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of tattoos clients are looking to have covered. Artists, find your next challenge!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No public cover-up posts yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="art-card overflow-hidden">
                  <img src={post.image_url} alt="Tattoo to be covered" className="w-full h-64 object-cover" />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={post.client?.avatar_url} alt={post.client?.full_name} />
                        <AvatarFallback>{post.client?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{post.client?.full_name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 italic">"{post.description || 'No description provided.'}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CoverUpPostsPage;