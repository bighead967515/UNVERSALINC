import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShopData = useCallback(async (shopId) => {
    if (!shopId) {
      setShop(null);
      return;
    }
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();

    if (shopData) {
      setShop(shopData);
    } else if (shopError) {
      console.error('Error fetching shop data:', shopError.message);
      setShop(null);
    }
  }, []);

  const fetchProfileAndShop = useCallback(async (userId) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*, artists (id)')
      .eq('id', userId)
      .single();

    if (profileData) {
      const userProfile = {
        ...profileData,
        is_artist: profileData.artists !== null && profileData.artists !== undefined
      };
      delete userProfile.artists;
      setProfile(userProfile);

      if (userProfile.role === 'ShopOwner' && userProfile.managed_shop_id) {
        await fetchShopData(userProfile.managed_shop_id);
      } else {
        setShop(null);
      }
    } else {
      setProfile(null);
      setShop(null);
      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
      }
    }
  }, [fetchShopData]);


  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfileAndShop(session.user.id);
      }
      setLoading(false);
    };

    fetchInitialData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true);
        const authUser = session?.user ?? null;
        setUser(authUser);
        if (authUser) {
          await fetchProfileAndShop(authUser.id);
        } else {
          setProfile(null);
          setShop(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfileAndShop]);

  const value = {
    user,
    profile,
    shop,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};