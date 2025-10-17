import React, { Suspense, lazy } from 'react';
    import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
    import { Helmet } from 'react-helmet';
    import { Toaster } from '@/components/ui/toaster';
    import Header from '@/components/Header';
    import Footer from '@/components/Footer';
    import { AnimatePresence } from 'framer-motion';
    import { AuthProvider } from '@/contexts/AuthContext';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import ArtistProtectedRoute from '@/components/ArtistProtectedRoute';
    import ClientProtectedRoute from '@/components/ClientProtectedRoute';
    import PageLoader from '@/components/PageLoader';
    import { StripeProvider } from '@/contexts/StripeContext';

    const HomePage = lazy(() => import('@/pages/HomePage'));
    const ArtistProfilePage = lazy(() => import('@/pages/ArtistProfilePage'));
    const ShopProfilePage = lazy(() => import('@/pages/ShopProfilePage'));
    const BrowsePage = lazy(() => import('@/pages/BrowsePage'));
    const LoginPage = lazy(() => import('@/pages/LoginPage'));
    const ArtistSignUpPage = lazy(() => import('@/pages/ArtistSignUpPage'));
    const ClientSignUpPage = lazy(() => import('@/pages/ClientSignUpPage'));
    const AboutPage = lazy(() => import('@/pages/AboutPage'));
    const ContactPage = lazy(() => import('@/pages/ContactPage'));
    const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
    const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
    const RightsAndResponsibilitiesPage = lazy(() => import('@/pages/RightsAndResponsibilitiesPage'));
    const LosAngelesPage = lazy(() => import('@/pages/LosAngelesPage'));
    const LouisianaPage = lazy(() => import('@/pages/LouisianaPage'));
    const CaliforniaPage = lazy(() => import('@/pages/CaliforniaPage'));
    const NewYorkPage = lazy(() => import('@/pages/NewYorkPage'));
    const TexasPage = lazy(() => import('@/pages/TexasPage'));
    const FloridaPage = lazy(() => import('@/pages/FloridaPage'));
    const ArizonaPage = lazy(() => import('@/pages/ArizonaPage'));
    const ColoradoPage = lazy(() => import('@/pages/ColoradoPage'));
    const GeorgiaPage = lazy(() => import('@/pages/GeorgiaPage'));
    const IllinoisPage = lazy(() => import('@/pages/IllinoisPage'));
    const MassachusettsPage = lazy(() => import('@/pages/MassachusettsPage'));
    const MichiganPage = lazy(() => import('@/pages/MichiganPage'));
    const NorthCarolinaPage = lazy(() => import('@/pages/NorthCarolinaPage'));
    const OhioPage = lazy(() => import('@/pages/OhioPage'));
    const PennsylvaniaPage = lazy(() => import('@/pages/PennsylvaniaPage'));
    const VirginiaPage = lazy(() => import('@/pages/VirginiaPage'));
    const WashingtonPage = lazy(() => import('@/pages/WashingtonPage'));
    const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
    const FAQPage = lazy(() => import('@/pages/FAQPage'));
    const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
    const DashboardRedirect = lazy(() => import('@/pages/dashboard/DashboardRedirect'));
    const ArtistDashboardPage = lazy(() => import('@/pages/dashboard/ArtistDashboardPage'));
    const ClientDashboardPage = lazy(() => import('@/pages/dashboard/ClientDashboardPage'));
    const ShopOwnerDashboardPage = lazy(() => import('@/pages/dashboard/ShopOwnerDashboardPage'));
    const CoverUpPostsPage = lazy(() => import('@/pages/CoverUpPostsPage'));
    const PricingPage = lazy(() => import('@/pages/PricingPage'));
    const DreamTattooPage = lazy(() => import('@/pages/DreamTattooPage'));
    const TattooAftercarePage = lazy(() => import('@/pages/TattooAftercarePage'));
    const StylePage = lazy(() => import('@/pages/StylePage'));
    const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
    const GalleryPage = lazy(() => import('@/pages/GalleryPage'));

    const ArtistDashboardOverview = lazy(() => import('@/components/dashboard/artist/ArtistDashboardOverview'));
    const ArtistPortfolioManager = lazy(() => import('@/components/dashboard/artist/ArtistPortfolioManager'));
    const ArtistBookings = lazy(() => import('@/components/dashboard/artist/ArtistBookings'));
    const ArtistProfileSettings = lazy(() => import('@/components/dashboard/artist/ArtistProfileSettings'));
    const ArtistAnalytics = lazy(() => import('@/components/dashboard/artist/ArtistAnalytics'));
    const ArtistJobBoard = lazy(() => import('@/components/dashboard/artist/ArtistJobBoard'));
    const BiddingAnalytics = lazy(() => import('@/components/dashboard/artist/BiddingAnalytics'));

    const ClientDashboardOverview = lazy(() => import('@/components/dashboard/client/ClientDashboardOverview'));
    const ClientBookings = lazy(() => import('@/components/dashboard/client/ClientBookings'));
    const ClientReviews = lazy(() => import('@/components/dashboard/client/ClientReviews'));
    const ClientCoverUpPosts = lazy(() => import('@/components/dashboard/client/ClientCoverUpPosts'));
    const ClientProfileSettings = lazy(() => import('@/components/dashboard/client/ClientProfileSettings'));
    const ClientPastTattoos = lazy(() => import('@/components/dashboard/client/ClientPastTattoos'));

    const ShopInfoManager = lazy(() => import('@/components/dashboard/shop_owner/ShopInfoManager'));
    const ArtistRosterManager = lazy(() => import('@/components/dashboard/shop_owner/ArtistRosterManager'));
    const ShopSubscriptionManager = lazy(() => import('@/components/dashboard/shop_owner/ShopSubscriptionManager'));
    const ShopAnalytics = lazy(() => import('@/components/dashboard/shop_owner/ShopAnalytics'));

    function AnimatedRoutes() {
      const location = useLocation();
      return (
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/artist/:id" element={<ArtistProfilePage />} />
              <Route path="/shop/:id" element={<ShopProfilePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/los-angeles" element={<LosAngelesPage />} />
              <Route path="/louisiana" element={<LouisianaPage />} />
              <Route path="/california" element={<CaliforniaPage />} />
              <Route path="/new-york" element={<NewYorkPage />} />
              <Route path="/texas" element={<TexasPage />} />
              <Route path="/florida" element={<FloridaPage />} />
              <Route path="/arizona" element={<ArizonaPage />} />
              <Route path="/colorado" element={<ColoradoPage />} />
              <Route path="/georgia" element={<GeorgiaPage />} />
              <Route path="/illinois" element={<IllinoisPage />} />
              <Route path="/massachusetts" element={<MassachusettsPage />} />
              <Route path="/michigan" element={<MichiganPage />} />
              <Route path="/north-carolina" element={<NorthCarolinaPage />} />
              <Route path="/ohio" element={<OhioPage />} />
              <Route path="/pennsylvania" element={<PennsylvaniaPage />} />
              <Route path="/virginia" element={<VirginiaPage />} />
              <Route path="/washington" element={<WashingtonPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<OnboardingPage />} />
              <Route path="/artist-signup" element={<ArtistSignUpPage />} />
              <Route path="/client-signup" element={<ClientSignUpPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/rights-responsibilities" element={<RightsAndResponsibilitiesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/tattoo-aftercare" element={<TattooAftercarePage />} />
              <Route path="/cover-up-posts" element={<CoverUpPostsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/dream-tattoo" element={<DreamTattooPage />} />
              <Route path="/style/:styleName" element={<StylePage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
              
              <Route path="/dashboard/artist" element={<ArtistProtectedRoute><ArtistDashboardPage /></ArtistProtectedRoute>}>
                <Route index element={<ArtistDashboardOverview />} />
                <Route path="overview" element={<ArtistDashboardOverview />} />
                <Route path="portfolio" element={<ArtistPortfolioManager />} />
                <Route path="bookings" element={<ArtistBookings />} />
                <Route path="job-board" element={<ArtistJobBoard />} />
                <Route path="portfolio-performance" element={<ArtistAnalytics />} />
                <Route path="bidding-analytics" element={<BiddingAnalytics />} />
                <Route path="settings" element={<ArtistProfileSettings />} />
              </Route>

              <Route path="/dashboard/client" element={<ClientProtectedRoute><ClientDashboardPage /></ClientProtectedRoute>}>
                <Route index element={<ClientDashboardOverview />} />
                <Route path="overview" element={<ClientDashboardOverview />} />
                <Route path="bookings" element={<ClientBookings />} />
                <Route path="reviews" element={<ClientReviews />} />
                <Route path="cover-up-posts" element={<ClientCoverUpPosts />} />
                <Route path="your-ink" element={<ClientPastTattoos />} />
                <Route path="profile" element={<ClientProfileSettings />} />
              </Route>

              <Route path="/dashboard/shop" element={<ProtectedRoute role="ShopOwner"><ShopOwnerDashboardPage /></ProtectedRoute>}>
                  <Route index element={<ShopInfoManager />} />
                  <Route path="details" element={<ShopInfoManager />} />
                  <Route path="roster" element={<ArtistRosterManager />} />
                  <Route path="analytics" element={<ShopAnalytics />} />
                  <Route path="subscription" element={<ShopSubscriptionManager />} />
              </Route>
            </Routes>
          </Suspense>
        </AnimatePresence>
      );
    }

    function App() {
      return (
        <Router>
          <AuthProvider>
            <StripeProvider>
              <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Helmet>
                  <title>Universal Inc - Tattoo Marketplace</title>
                  <meta name="description" content="Universal Inc: The ultimate marketplace to find visionary tattoo artists. Connect with clients, explore styles, and bring your tattoo ideas to life." />
                </Helmet>
                
                <Header />
                
                <main className="flex-grow pt-20">
                  <AnimatedRoutes />
                </main>
                
                <Footer />
                <Toaster />
              </div>
            </StripeProvider>
          </AuthProvider>
        </Router>
      );
    }

    export default App;