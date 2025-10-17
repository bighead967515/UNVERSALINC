import React, { useState, useMemo } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
    import { X } from 'lucide-react';

    const PortfolioGallery = ({ portfolio }) => {
      const [filter, setFilter] = useState('All');
      const [selectedImage, setSelectedImage] = useState(null);

      const categories = useMemo(() => {
        if (!portfolio || portfolio.length === 0) return ['All'];
        return ['All', ...new Set(portfolio.map(p => p.category).filter(Boolean))];
      }, [portfolio]);

      const filteredPortfolio = useMemo(() => {
        if (filter === 'All') return portfolio;
        return portfolio.filter(p => p.category === filter);
      }, [filter, portfolio]);

      if (!portfolio || portfolio.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground">Portfolio is currently empty.</h3>
                <p className="text-muted-foreground">This artist hasn't uploaded any work yet. Check back soon!</p>
            </div>
        );
      }

      return (
        <div className="py-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <Button
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                onClick={() => setFilter(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          <motion.div layout className="masonry-grid">
            <AnimatePresence>
              {filteredPortfolio.map((piece, index) => (
                <motion.div
                  key={piece.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="masonry-item mb-4 break-inside-avoid"
                  onClick={() => setSelectedImage(piece)}
                >
                  <div className="relative rounded-lg overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      className="w-full h-auto object-cover"
                      alt={piece.title}
                      src={piece.image_url} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <p className="text-white text-center font-semibold">{piece.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {selectedImage && (
              <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0 bg-card border-border shadow-2xl">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="grid md:grid-cols-2"
                  >
                    <div className="relative">
                        <img 
                        className="w-full h-auto max-h-[80vh] object-contain"
                        alt={selectedImage.title}
                        src={selectedImage.image_url} />
                    </div>
                    <div className="p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-2xl gradient-text">{selectedImage.title}</DialogTitle>
                            <DialogDescription className="text-base !text-muted-foreground">{selectedImage.category}</DialogDescription>
                        </DialogHeader>
                        <p className="text-foreground/80 mt-4 flex-grow">{selectedImage.description || "No description provided."}</p>
                    </div>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                  </motion.div>
                </DialogContent>
              </Dialog>
            )}
          </AnimatePresence>

          <style jsx>{`
            .masonry-grid {
              column-count: 1;
              column-gap: 1rem;
            }
            @media (min-width: 640px) {
              .masonry-grid {
                column-count: 2;
              }
            }
            @media (min-width: 1024px) {
              .masonry-grid {
                column-count: 3;
              }
            }
            .masonry-item {
              display: inline-block;
              width: 100%;
            }
          `}</style>
        </div>
      );
    };

    export default PortfolioGallery;