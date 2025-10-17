import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Building, Users, CreditCard, BarChart, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getTierPermissions } from '@/lib/subscriptionTiers';
import UpgradeModal from '@/components/dashboard/shop_owner/UpgradeModal';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ShopOwnerDashboardPage = () => {
  const { user, profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState({ title: '', description: ''});
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      if (user && profile && profile.role === 'ShopOwner') {
        // Check if managed_shop_id exists on profile
        if (profile.managed_shop_id) {
          const { data, error } = await supabase
            .from('shops')
            .select('*')
            .eq('id', profile.managed_shop_id)
            .single();
          if (error) console.error("Error fetching shop by managed_shop_id", error);
          else setShop(data);
        } else {
          // Fallback for older profiles: check shops table by owner_id
          const { data, error } = await supabase
            .from('shops')
            .select('*')
            .eq('owner_id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching shop by owner_id", error);
          } else if (data) {
            setShop(data);
            // Backfill managed_shop_id on profile for future queries
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ managed_shop_id: data.id })
              .eq('id', user.id);
            if (updateError) console.error("Error backfilling managed_shop_id", updateError);
            else setProfile({...profile, managed_shop_id: data.id });
          }
        }
      }
    };
    fetchShop();
  }, [user, profile, setProfile]);

  const currentTier = shop?.subscription_tier || 'free';
  const permissions = getTierPermissions(currentTier);

  const handleLockedFeatureClick = (requiredTier, featureName) => {
    setUpgradeReason({
        title: `Unlock ${featureName}!`,
        description: `This feature is available on the ${requiredTier} plan and above. Upgrade now to get access.`
    });
    setIsUpgradeModalOpen(true);
  };

  const navItems = [
    { 
      label: 'Shop Details', 
      href: '/dashboard/shop/details', 
      icon: Building,
      isLocked: false,
    },
    { 
      label: 'Artist Roster', 
      href: '/dashboard/shop/roster', 
      icon: Users,
      isLocked: false,
    },
    { 
      label: 'Analytics', 
      href: '/dashboard/shop/analytics', 
      icon: BarChart,
      isLocked: !permissions.hasAnalytics,
      onClick: !permissions.hasAnalytics ? () => handleLockedFeatureClick('Starter', 'Analytics') : undefined,
    },
    { 
      label: 'Subscription', 
      href: '/dashboard/shop/subscription', 
      icon: CreditCard,
      isLocked: false,
    },
  ];
  
  const pageTitle = "Shop Management Dashboard";
  const pageDescription = "Manage your shop details, artist roster, and subscription.";

  return (
    <>
      <DashboardLayout
        sidebarNavItems={navItems}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        headerContent={
          <Button onClick={() => navigate('/dashboard/shop/subscription')}>
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade Your Plan
          </Button>
        }
      >
        <Outlet context={{ handleLockedFeatureClick, shop }} />
      </DashboardLayout>
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title={upgradeReason.title}
        description={upgradeReason.description}
      />
    </>
  );
};

export default ShopOwnerDashboardPage;