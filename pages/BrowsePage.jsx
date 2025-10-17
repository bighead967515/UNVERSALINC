import React from 'react';
import { Helmet } from 'react-helmet';
import FilterBar from '@/components/browse/FilterBar';
import ArtistGrid from '@/components/browse/ArtistGrid';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Button } from '@/components/ui/button';
import { List, Map } from 'lucide-react';

const customIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


const BrowsePage = () => {
  const [filters, setFilters] = React.useState({
    location: '',
    style: '',
    rating: 0,
    sortBy: 'rating',
    verifiedOnly: false,
  });
  const [view, setView] = React.useState('grid');

  const artists = [
    { id: 1, name: 'Sample Artist 1', position: [51.505, -0.09] },
    { id: 2, name: 'Sample Artist 2', position: [51.51, -0.1] },
    { id: 3, name: 'Sample Artist 3', position: [51.49, -0.08] },
  ];

  return (
    <>
      <Helmet>
        <title>Browse Tattoo Artists | Universal Inc</title>
        <meta name="description" content="Find and filter tattoo artists by location, style, and rating. Discover your next tattoo artist on Universal Inc." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black tracking-tighter mb-2">Find Your <span className="gradient-text">Visionary Artist</span></h1>
          <p className="text-xl text-muted-foreground font-mono max-w-3xl mx-auto">
            Use the filters below to discover the perfect tattoo artist for your unique style.
          </p>
        </motion.div>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        <div className="flex justify-end my-4">
          <Button variant="outline" onClick={() => setView(view === 'grid' ? 'map' : 'grid')}>
            {view === 'grid' ? <Map className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
            {view === 'grid' ? 'Map View' : 'Grid View'}
          </Button>
        </div>

        {view === 'grid' ? (
          <ArtistGrid filters={filters} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="art-card p-2 rounded-xl shadow-lg"
          >
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '600px', width: '100%', borderRadius: '0.75rem' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {artists.map(artist => (
                <Marker key={artist.id} position={artist.position} icon={customIcon}>
                  <Popup>{artist.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default BrowsePage;