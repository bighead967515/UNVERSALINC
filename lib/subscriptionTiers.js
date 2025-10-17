export const tiers = {
    free: {
        name: 'Free',
        maxArtists: 3,
        maxPhotos: 10,
        hasVerifiedBadge: false,
        hasBookingIntegration: false,
        flashPostsLimit: 0,
        hasDirectMessaging: false,
        searchRanking: 'standard',
        hasFeaturedPlacement: false,
        hasCompetitorAds: true,
        hasAnalytics: false,
        hasAdvancedAnalytics: false,
        supportLevel: 'email',
        hasMultiLocation: false,
    },
    starter: {
        name: 'Starter',
        maxArtists: 10,
        maxPhotos: 50,
        hasVerifiedBadge: true,
        hasBookingIntegration: false,
        flashPostsLimit: 1,
        hasDirectMessaging: false,
        searchRanking: 'standard',
        hasFeaturedPlacement: false,
        hasCompetitorAds: false,
        hasAnalytics: true,
        hasAdvancedAnalytics: false,
        supportLevel: 'email',
        hasMultiLocation: false,
    },
    pro: {
        name: 'Pro',
        maxArtists: Infinity,
        maxPhotos: Infinity,
        hasVerifiedBadge: true,
        hasBookingIntegration: true,
        flashPostsLimit: 5,
        hasDirectMessaging: true,
        searchRanking: 'boosted',
        hasFeaturedPlacement: true, // Rotational
        hasCompetitorAds: false,
        hasAnalytics: true,
        hasAdvancedAnalytics: true,
        supportLevel: 'priority_email',
        hasMultiLocation: false,
    },
    elite: {
        name: 'Elite',
        maxArtists: Infinity,
        maxPhotos: Infinity, // with video
        hasVerifiedBadge: true,
        hasBookingIntegration: true,
        flashPostsLimit: Infinity,
        hasDirectMessaging: true,
        searchRanking: 'top_tier',
        hasFeaturedPlacement: true, // Guaranteed
        hasCompetitorAds: false,
        hasAnalytics: true,
        hasAdvancedAnalytics: true,
        supportLevel: 'priority_phone_email',
        hasMultiLocation: true,
    }
};

export const getTierPermissions = (tierId) => {
    return tiers[tierId] || tiers.free;
};