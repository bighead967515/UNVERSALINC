import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, UserPlus, Edit, Trash2 } from 'lucide-react';
import ArtistForm from './ArtistForm';
import { getTierPermissions } from '@/lib/subscriptionTiers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const ArtistRosterManager = () => {
  const { handleLockedFeatureClick, shop } = useOutletContext();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);

  const currentTier = shop?.subscription_tier || 'free';
  const permissions = getTierPermissions(currentTier);
  const canAddArtist = artists.length < permissions.maxArtists;

  const fetchArtists = useCallback(async () => {
    if (shop?.id) {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('shop_id', shop.id)
        .order('name');
      
      if (error) {
        toast({ variant: 'destructive', title: 'Error fetching artists', description: error.message });
      } else {
        setArtists(data);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [shop]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);
  
  const handleEdit = (artist) => {
    setEditingArtist(artist);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    if (!canAddArtist) {
        handleLockedFeatureClick('the next tier', 'more artist slots');
        return;
    }
    setEditingArtist(null);
    setIsFormOpen(true);
  };

  const handleRemove = async (artistId) => {
    if (!window.confirm("Are you sure you want to remove this artist from your shop? This will not delete their profile, but will unlink them from your shop.")) {
      return;
    }
    const { error } = await supabase
      .from('artists')
      .update({ shop_id: null })
      .eq('id', artistId);

    if (error) {
      toast({ variant: "destructive", title: "Failed to remove artist.", description: error.message });
    } else {
      toast({ title: "Artist Removed", description: "The artist has been unlinked from your shop." });
      fetchArtists();
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingArtist(null);
    fetchArtists();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!shop?.id) {
    return <p>Shop not found. Please ensure your shop is set up correctly.</p>;
  }

  const AddArtistButton = () => {
    const button = (
        <Button onClick={handleAddNew} disabled={!canAddArtist}>
            <UserPlus className="mr-2 h-4 w-4" /> Add New Artist
        </Button>
    );

    if (canAddArtist) {
        return (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>{button}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingArtist ? 'Edit Artist' : 'Add New Artist'}</DialogTitle>
                    </DialogHeader>
                    <ArtistForm artist={editingArtist} shopId={shop.id} onSuccess={handleFormSuccess} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span tabIndex="0">{button}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>You've reached the artist limit for the {currentTier} plan. <br /> Upgrade to add more artists.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Artist Roster</CardTitle>
          <CardDescription>You have {artists.length} / {permissions.maxArtists === Infinity ? 'Unlimited' : permissions.maxArtists} artists. Manage the artists at your shop.</CardDescription>
        </div>
        <AddArtistButton />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {artists.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No artists found for this shop.</p>
          ) : (
            artists.map(artist => (
              <div key={artist.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{artist.name}</p>
                  <p className="text-sm text-muted-foreground">{artist.style || 'No style specified'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={editingArtist?.id === artist.id} onOpenChange={(isOpen) => !isOpen && setEditingArtist(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(artist)}><Edit className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Edit Artist</DialogTitle>
                      </DialogHeader>
                      <ArtistForm artist={editingArtist} shopId={shop.id} onSuccess={handleFormSuccess} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="icon" onClick={() => handleRemove(artist.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistRosterManager;