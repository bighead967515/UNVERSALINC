import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const role = user.user_metadata?.role;
      if (role === 'artist') {
        navigate('/dashboard/artist', { replace: true });
      } else if (role === 'client') {
        navigate('/dashboard/client', { replace: true });
      } else {
        // Fallback for users with no role or unexpected role
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
};

export default DashboardRedirect;