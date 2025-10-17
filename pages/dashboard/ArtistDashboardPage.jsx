import React from 'react';
    import { Outlet } from 'react-router-dom';
    import DashboardLayout from './DashboardLayout';
    import { LayoutDashboard, Image as Images, Calendar, Gem, User, Briefcase, BarChart2, Target } from 'lucide-react';

    const artistNavItems = [
      { href: '/dashboard/artist/overview', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/artist/portfolio', label: 'Portfolio', icon: Images },
      { href: '/dashboard/artist/bookings', label: 'Bookings', icon: Calendar },
      { href: '/dashboard/artist/job-board', label: 'Job Board', icon: Briefcase },
      { href: '/dashboard/artist/portfolio-performance', label: 'Portfolio Performance', icon: BarChart2 },
      { href: '/dashboard/artist/bidding-analytics', label: 'Bidding Analytics', icon: Target },
      { href: '/dashboard/artist/subscription', label: 'Subscription', icon: Gem },
      { href: '/dashboard/artist/settings', label: 'Profile Settings', icon: User },
    ];
    
    const ArtistDashboardPage = () => {
      const pageTitle = "Artist Dashboard";
      const pageDescription = "Manage your portfolio, bookings, and artist profile on Universal Inc.";
    
      return (
        <DashboardLayout
          sidebarNavItems={artistNavItems}
          pageTitle={pageTitle}
          pageDescription={pageDescription}
        >
          <Outlet />
        </DashboardLayout>
      );
    };
    
    export default ArtistDashboardPage;