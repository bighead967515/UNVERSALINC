import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, MapPin, Star, Users, Heart, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ArtistsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const artists = [
    {
      id: 1,
      name: "Maya Rodriguez",
      style: "Neo-Traditional",
      location: "Los Angeles, CA",
      rating: 4.9,
      reviews: 127,
      experience: "8 years",
      priceRange: "$150-300/hr",
      specialties: ["Color Work", "Large Pieces", "Custom Design"],
      image: "Professional tattoo artist Maya Rodriguez in her modern studio",
      portfolio: "Colorful neo-traditional tattoo portfolio by Maya Rodriguez"
    },
    {
      id: 2,
      name: "Jake Thompson",
      style: "Blackwork",
      location: "New York, NY",
      rating: 4.8,
      reviews: 89,
      experience: "6 years",
      priceRange: "$120-250/hr",
      specialties: ["Geometric", "Minimalist", "Linework"],
      image: "Skilled blackwork tattoo artist Jake Thompson creating detailed designs",
      portfolio: "Bold geometric blackwork tattoo designs by Jake Thompson"
    },
    {
      id: 3,
      name: "Sofia Chen",
      style: "Watercolor",
      location: "San Francisco, CA",
      rating: 5.0,
      reviews: 156,
      experience: "10 years",
      priceRange: "$200-400/hr",
      specialties: ["Floral", "Abstract", "Color Blending"],
      image: "Talented watercolor tattoo artist Sofia Chen working on vibrant designs",
      portfolio: "Beautiful watercolor tattoo artwork by Sofia Chen"
    },
    {
      id: 4,
      name: "Alex Kumar",
      style: "Dotwork",
      location: "Austin, TX",
      rating: 4.7,
      reviews: 73,
      experience: "5 years",
      priceRange: "$100-200/hr",
      specialties: ["Mandala", "Sacred Geometry", "Stippling"],
      image: "Precise dotwork tattoo artist Alex Kumar creating intricate patterns",
      portfolio: "Detailed dotwork and mandala tattoos by Alex Kumar"
    },
    {
      id: 5,
      name: "Emma Wilson",
      style: "Realism",
      location: "Chicago, IL",
      rating: 4.9,
      reviews: 142,
      experience: "12 years",
      priceRange: "$250-500/hr",
      specialties: ["Portraits", "Wildlife", "Photo Realism"],
      image: "Master realism tattoo artist Emma Wilson working on photorealistic portrait",
      portfolio: "Stunning photorealistic tattoo portraits by Emma Wilson"
    },
    {
      id: 6,
      name: "Marcus Johnson",
      style: "Traditional",
      location: "Miami, FL",
      rating: 4.6,
      reviews: 98,
      experience: "15 years",
      priceRange: "$120-280/hr",
      specialties: ["American Traditional", "Sailor Jerry", "Bold Lines"],
      image: "Experienced traditional tattoo artist Marcus Johnson in classic tattoo parlor",
      portfolio: "Classic American traditional tattoos by Marcus Johnson"
    }
  ];

  const styles = [
    "All Styles", "Neo-Traditional", "Blackwork", "Watercolor", 
    "Dotwork", "Realism", "Traditional", "Japanese", "Minimalist"
  ];

  const locations = [
    "All Locations", "Los Angeles, CA", "New York, NY", "San Francisco, CA",
    "Austin, TX", "Chicago, IL", "Miami, FL", "Seattle, WA", "Denver, CO"
  ];

  const filteredArtists = artists.filter(artist => {
    const styleMatch = selectedStyle === 'all' || artist.style.toLowerCase() === selectedStyle.toLowerCase();
    const locationMatch = selectedLocation === 'all' || artist.location === selectedLocation;
    return styleMatch && locationMatch;
  });

  return (
    <>
      <Helmet>
        <title>Browse Tattoo Artists - InkConnect</title>
        <meta name="description" content="Discover verified tattoo artists near you. Browse portfolios, read reviews, and find the perfect artist for your next tattoo." />
      </Helmet>

      <div className="min-h-screen bg-background pt-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Discover <span className="gradient-text">Artists</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our curated collection of verified tattoo artists. Find the perfect match for your style and vision.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artists, styles, locations..."
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground search-glow focus:outline-none"
                  onFocus={() => handleFeatureClick('search')}
                />
              </div>

              {/* Style Filter */}
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none search-glow"
              >
                {styles.map((style) => (
                  <option key={style} value={style === 'All Styles' ? 'all' : style}>
                    {style}
                  </option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none search-glow"
              >
                {locations.map((location) => (
                  <option key={location} value={location === 'All Locations' ? 'all' : location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode and Additional Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <Button
                  variant="ghost"
                  onClick={() => handleFeatureClick('advanced-filters')}
                  className="text-foreground hover:text-primary hover:bg-muted"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                <span className="text-muted-foreground text-sm">
                  {filteredArtists.length} artists found
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Artists Grid/List */}
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`artist-card rounded-2xl overflow-hidden ${
                  viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'md:w-1/3' : ''}`}>
                  <img  
                    className={`w-full object-cover ${viewMode === 'list' ? 'h-64 md:h-full' : 'h-64'}`}
                    alt={`${artist.name} - ${artist.style} tattoo artist`}
                   src="https://images.unsplash.com/photo-1577683954096-f2ee04da19f8" />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span className="text-white text-sm font-medium">{artist.rating}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeatureClick('favorite')}
                    className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white hover:text-primary hover:bg-black/80"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className={`p-6 ${viewMode === 'list' ? 'md:w-2/3 flex flex-col justify-between' : ''}`}>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                    <p className="text-primary font-medium mb-2">{artist.style}</p>
                    
                    <div className="flex items-center space-x-2 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{artist.location}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{artist.reviews} reviews</span>
                      </div>
                      <span className="text-sm">{artist.experience} experience</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-foreground font-medium mb-2">{artist.priceRange}</p>
                      <div className="flex flex-wrap gap-2">
                        {artist.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-muted text-foreground text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link to={`/artist/${artist.id}`} className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all hover-glow">
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleFeatureClick('contact')}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg font-medium transition-all"
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12 mb-20"
          >
            <Button
              onClick={() => handleFeatureClick('load-more')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg rounded-lg font-medium transition-all hover-glow"
            >
              Load More Artists
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ArtistsPage;