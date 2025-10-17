import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mail, Briefcase, BarChart2, ArrowRight, Loader2, Award, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const ArtistDashboardOverview = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ newBookings: 0, newJobs: 0, rating: 'N/A' });
  const [loading, setLoading] = useState(true);
  const [artistId, setArtistId] = useState(null);

  const fetchArtistId = useCallback(async () => {
    if (profile?.id) {
      const { data, error } = await supabase
        .from('artists')
        .select('id, rating')
        .eq('user_id', profile.id)
        .single();
      if (error) console.error("Error fetching artist id", error);
      else {
        setArtistId(data.id);
        setStats(prev => ({...prev, rating: data.rating?.toFixed(1) || 'N/A' }));
      }
    }
  }, [profile]);
  
  useEffect(() => {
    fetchArtistId();
  }, [fetchArtistId]);


  const fetchStats = useCallback(async () => {
    setLoading(true);
    const bookingsPromise = artistId ? supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('artist_id', artistId)
      .eq('status', 'pending') : Promise.resolve({ count: 0 });

    const jobsPromise = supabase
      .from('tattoo_requests')
      .select('id', { count: 'exact' })
      .eq('status', 'open');
      
    const [{ count: bookingsCount }, { count: jobsCount }] = await Promise.all([
      bookingsPromise,
      jobsPromise
    ]);

    setStats(prev => ({
      ...prev,
      newBookings: bookingsCount || 0,
      newJobs: jobsCount || 0,
    }));
    setLoading(false);
  }, [artistId]);

  useEffect(() => {
    if (artistId) {
      fetchStats();
    } else if (profile) { // if profile is loaded but artistId isn't (yet)
      setLoading(false);
    }
  }, [artistId, profile, fetchStats]);

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
      <h1 className="text-4xl font-black mb-2">Artist <span className="gradient-text">Overview</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Welcome back! Here's a snapshot of your activity.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="New Inquiries" value={stats.newBookings} icon={Mail} link="/dashboard/artist/bookings" description="Pending booking requests." />
        <StatCard title="Open Jobs" value={stats.newJobs} icon={Briefcase} link="/dashboard/artist/job-board" description="Client tattoo requests." />
        <StatCard title="Profile Rating" value={stats.rating} icon={BarChart2} link="/artist-profile-page" description="Overall client rating." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link to="/dashboard/artist/portfolio"><Button>Upload New Art</Button></Link>
          <Link to="/dashboard/artist/job-board"><Button variant="secondary">Browse Job Board</Button></Link>
          <Link to="/dashboard/artist/settings"><Button variant="outline">Update Profile</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistDashboardOverview;