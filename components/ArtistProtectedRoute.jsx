import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoader from './PageLoader';

const ArtistProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user || profile?.account_type !== 'artist') {
    return <Navigate to="/login" replace />;
  }
  
  return children ? children : <Outlet />;
};

export default ArtistProtectedRoute;