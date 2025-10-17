import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Briefcase, Send, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getTierPermissions } from '@/lib/subscriptionTiers';

const QualificationScore = ({ score }) => {
  const scoreColor = score > 75 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Star className={cn("w-5 h-5", scoreColor)} />
        <p className="font-semibold">Qualification Score</p>
      </div>
      <p className={cn("text-xl font-bold", scoreColor)}>{score}%</p>
    </div>
  );
};

const BidModal = ({ isOpen, onClose, request, artistProfile, onBidSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [qualificationScore, setQualificationScore] = useState(0);

  const permissions = getTierPermissions(artistProfile?.subscription_tier || 'free');
  const canBid = permissions.canBidOnJobs;

  useEffect(() => {
    if (request && artistProfile) {
      const artistStyles = artistProfile.style ? artistProfile.style.toLowerCase().split(',').map(s => s.trim()) : [];
      const requestStyles = request.style_tags || [];
      
      if (requestStyles.length === 0) {
        setQualificationScore(50);
        return;
      }

      const matchedStyles = requestStyles.filter(style => artistStyles.includes(style.toLowerCase()));
      const score = (matchedStyles.length / requestStyles.length) * 100;
      setQualificationScore(Math.round(score));
    }
  }, [request, artistProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canBid) {
      toast({ variant: 'destructive', title: 'Upgrade to bid', description: 'You need to upgrade your plan to bid on jobs.' });
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('bids').insert({
      request_id: request.id,
      artist_id: artistProfile.id,
      amount: amount ? parseFloat(amount) : null,
      message: message,
      status: 'pending',
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to place bid', description: error.message });
    } else {
      toast({ title: 'Success!', description: 'Your bid has been submitted.' });
      onBidSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place Bid on "{request?.title}"</DialogTitle>
          <DialogDescription>
            Submit your bid and a message to the client. Your qualification score helps you understand how good a fit you are.
          </DialogDescription>
        </DialogHeader>
        {canBid ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <QualificationScore score={qualificationScore} />
            <div>
              <label htmlFor="amount" className="text-sm font-medium">Bid Amount (Optional)</label>
              <Input id="amount" type="number" placeholder="$" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea id="message" placeholder="Introduce yourself and explain why you're a great fit for this tattoo." value={message} onChange={(e) => setMessage(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Bid
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-semibold mb-4">Upgrade to Bid on Jobs</p>
            <p className="text-muted-foreground mb-6">Your current plan doesn't allow bidding. Upgrade to connect with clients.</p>
            <Link to="/dashboard/artist/subscription">
              <Button>View Plans</Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ArtistJobBoard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();
  const [artistProfile, setArtistProfile] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const fetchArtistProfile = useCallback(async () => {
    if (profile?.id) {
      const { data, error } = await supabase
        .from('artists')
        .select('id, subscription_tier, style')
        .eq('user_id', profile.id)
        .single();
      if (error) {
        toast({ variant: 'destructive', title: 'Could not load artist profile' });
      } else {
        setArtistProfile(data);
      }
    }
  }, [profile, toast]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tattoo_requests')
      .select('*, client:profiles(full_name, avatar_url)')
      .eq('is_public', true)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to load jobs', description: error.message });
    } else {
      setRequests(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchArtistProfile();
    fetchRequests();
  }, [fetchArtistProfile, fetchRequests]);

  const handlePlaceBid = (request) => {
    setSelectedRequest(request);
    setIsBidModalOpen(true);
  };
  
  return (
    <div>
      {selectedRequest && (
        <BidModal
          isOpen={isBidModalOpen}
          onClose={() => setIsBidModalOpen(false)}
          request={selectedRequest}
          artistProfile={artistProfile}
          onBidSuccess={fetchRequests}
        />
      )}
      <h1 className="text-4xl font-black mb-2">Client <span className="gradient-text">Job Board</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Find your next project. Browse tattoo requests from clients.</p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 art-card">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">The job board is empty for now.</p>
          <p className="text-sm text-muted-foreground">Check back soon for new client requests!</p>
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
                  <Button className="w-full" onClick={() => handlePlaceBid(request)} disabled={!artistProfile}>
                    <Send className="mr-2 h-4 w-4" />
                    Place Bid
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistJobBoard;