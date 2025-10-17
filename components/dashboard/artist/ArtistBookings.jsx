import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ArtistBookings = () => {
  const { artist, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!artist?.id) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:profiles(full_name, avatar_url)
      `)
      .eq('artist_id', artist.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching bookings', description: error.message });
    } else {
      setBookings(data);
    }
    setLoading(false);
  }, [artist]);

  useEffect(() => {
    if (!authLoading) {
      fetchBookings();
    }
  }, [authLoading, fetchBookings]);

  const renderBookingList = (bookingList) => {
    if (bookingList.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No bookings in this category.</p>;
    }

    return (
      <div className="space-y-4 p-4">
        {bookingList.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={booking.client?.avatar_url} />
                <AvatarFallback>{booking.client?.full_name?.substring(0, 2) || 'N/A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{booking.client?.full_name || 'Unknown Client'}</p>
                <p className="text-sm text-muted-foreground">{booking.tattoo_style || 'No style specified'}</p>
              </div>
              <Badge variant={booking.status === 'pending' ? 'secondary' : 'default'}>{booking.status}</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-mono">
                {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
              </p>
              <Button size="sm" className="mt-1">View</Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading || authLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const otherBookings = bookings.filter(b => b.status !== 'pending' && b.status !== 'confirmed');

  return (
    <div>
      <h1 className="text-4xl font-black mb-2">Bookings & <span className="gradient-text">Inquiries</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Manage your client messages and appointment requests.</p>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card><CardContent className="p-0">{renderBookingList(pendingBookings)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="confirmed">
          <Card><CardContent className="p-0">{renderBookingList(confirmedBookings)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="all">
          <Card><CardContent className="p-0">{renderBookingList(bookings)}</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistBookings;