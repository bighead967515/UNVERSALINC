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
import { format } from 'date-fns';

const ClientBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        artist:artists(name, image_url)
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching bookings', description: error.message });
    } else {
      setBookings(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchBookings();
    }
  }, [authLoading, fetchBookings]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'canceled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

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
                <AvatarImage src={booking.artist?.image_url} />
                <AvatarFallback>{booking.artist?.name?.substring(0, 2) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{booking.artist?.name || 'Unknown Artist'}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.booking_date ? format(new Date(booking.booking_date), 'PPP') : 'Date TBD'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
              <Button size="sm" variant="outline" className="mt-1">
                {booking.status === 'completed' ? 'Leave Review' : 'Details'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading || authLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status !== 'pending' && b.status !== 'confirmed');

  return (
    <div>
      <h1 className="text-4xl font-black mb-2">My <span className="gradient-text">Bookings</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Track your upcoming and past appointments.</p>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Card><CardContent className="p-0">{renderBookingList(upcomingBookings)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="past">
          <Card><CardContent className="p-0">{renderBookingList(pastBookings)}</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientBookings;