import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { LayoutDashboard, Calendar, Star, PenTool, User, Trash2 } from 'lucide-react';

const ClientDashboardPage = () => {
  const sidebarNavItems = [
    { title: 'Overview', href: '/dashboard/client/overview', icon: LayoutDashboard },
    { title: 'My Bookings', href: '/dashboard/client/bookings', icon: Calendar },
    { title: 'My Reviews', href: '/dashboard/client/reviews', icon: Star },
    { title: 'Your Ink', href: '/dashboard/client/your-ink', icon: PenTool },
    { title: 'Cover-Up Posts', href: '/dashboard/client/cover-up-posts', icon: Trash2 },
    { title: 'Profile Settings', href: '/dashboard/client/profile', icon: User },
  ];

  return (
    <DashboardLayout
      sidebarNavItems={sidebarNavItems}
      pageTitle="Client Dashboard"
      pageDescription="Manage your bookings, reviews, and profile."
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default ClientDashboardPage;