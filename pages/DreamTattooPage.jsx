import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DreamTattooPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tattoo_requests')
        .select(`
          *,
          client:profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tattoo requests:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load requests',
          description: error.message,
        });
      } else {
        setRequests(data);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [toast]);

  const handleContact = () => {
    toast({
      title: '🚧 Feature Coming Soon!',
      description: `This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Dream Tattoo Board | InkConnect</title>
        <meta name="description" content="Browse through a gallery of dream tattoo ideas posted by clients. Find your next project and bring someone's vision to life." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-5xl font-black mb-2">Dream Tattoo <span className="gradient-text">Board</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A gallery of inspiration. Clients post their ideas, artists bring them to life.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">The dream board is empty for now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="art-card overflow-hidden h-full flex flex-col">
                  {request.image_url && <img src={request.image_url} alt="Tattoo reference" className="w-full h-56 object-cover" />}
                  <CardContent className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={request.client?.avatar_url} alt={request.client?.full_name} />
                        <AvatarFallback>{request.client?.full_name?.charAt(0) || 'C'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{request.client?.full_name || 'A Client'}</p>
                        <p className="text-xs text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{request.title}</h3>
                    <p className="text-sm text-foreground/80 mb-4 flex-grow">{request.description}</p>
                    {request.body_placement && <p className="text-sm font-semibold text-muted-foreground mb-4">Placement: <span className="font-normal text-foreground">{request.body_placement}</span></p>}
                    <div className="flex flex-wrap gap-2">
                      {request.style_tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-muted/50">
                    <Button className="w-full" onClick={handleContact}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Client
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default DreamTattooPage;