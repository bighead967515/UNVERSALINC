import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Star, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const ClientDashboardOverview = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, reviews: 0, favorites: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const bookingsPromise = supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('client_id', user.id)
      .in('status', ['pending', 'confirmed']);

    const reviewsPromise = supabase
      .from('reviews')
      .select('id', { count: 'exact' })
      .eq('client_id', user.id);
      
    // Placeholder for favorites
    const favoritesPromise = Promise.resolve({ count: 0 });

    const [{ count: bookingsCount }, { count: reviewsCount }, { count: favoritesCount }] = await Promise.all([
      bookingsPromise,
      reviewsPromise,
      favoritesPromise
    ]);

    setStats({
      bookings: bookingsCount || 0,
      reviews: reviewsCount || 0,
      favorites: favoritesCount || 0,
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchStats();
    }
  }, [authLoading, fetchStats]);

  const StatCard = ({ title, value, icon, link, description }) => {
    const Icon = icon;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            <Icon className="w-6 h-6 text-primary" />
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <p className="text-4xl font-bold">{value}</p>
          )}
          <Link to={link}>
            <Button variant="link" className="px-0">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <h1 className="text-4xl font-black mb-2">Client <span className="gradient-text">Overview</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Welcome back! Here's a summary of your account.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Upcoming Bookings" value={stats.bookings} icon={Calendar} link="/dashboard/client/bookings" description="Confirmed appointments" />
        <StatCard title="Reviews Left" value={stats.reviews} icon={Star} link="/dashboard/client/reviews" description="Your feedback to artists" />
        <StatCard title="Favorite Artists" value={stats.favorites} icon={Heart} link="/dashboard/client/favorites" description="Artists you're following" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ready for your next piece?</CardTitle>
          <CardDescription>Explore artists to find inspiration for your next tattoo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link to="/browse">
            <Button>Browse Artists</Button>
          </Link>
          <Link to="/dream-tattoo">
            <Button variant="secondary">Post a Dream Tattoo</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboardOverview;