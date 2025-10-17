import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

const stockImages = [
  { id: 1, alt: 'A black and grey realism tattoo of a lion on a forearm', description: 'Black and Grey Realism Lion Tattoo' },
  { id: 2, alt: 'A colorful neo-traditional tattoo of a fox surrounded by flowers', description: 'Colorful Neo-Traditional Fox Tattoo' },
  { id: 3, alt: 'A geometric wolf tattoo with intricate line work', description: 'Geometric Wolf Tattoo' },
  { id: 4, alt: 'A minimalist fine-line tattoo of a mountain range on a wrist', description: 'Fine-Line Mountain Tattoo' },
  { id: 5, alt: 'A Japanese-style dragon sleeve tattoo in vibrant colors', description: 'Japanese Dragon Sleeve Tattoo' },
  { id: 6, alt: 'A surrealist tattoo combining an hourglass with a galaxy scene', description: 'Surrealist Hourglass Galaxy Tattoo' },
  { id: 7, alt: 'A detailed portrait tattoo of a woman with floral elements', description: 'Floral Woman Portrait Tattoo' },
  { id: 8, alt: 'An American traditional eagle tattoo on a chest', description: 'American Traditional Eagle Tattoo' },
  { id: 9, alt: 'A watercolor style tattoo of a hummingbird in mid-flight', description: 'Watercolor Hummingbird Tattoo' },
  { id: 10, alt: 'A large back piece with biomechanical details and gears', description: 'Biomechanical Back Tattoo' },
  { id: 11, alt: 'A tribal pattern tattoo wrapping around an arm', description: 'Tribal Armband Tattoo' },
  { id: 12, alt: 'A dotwork mandala tattoo on a shoulder blade', description: 'Dotwork Mandala Tattoo' },
];

const InspirationGallery = ({ onSelect, onBack }) => {
  return (
    <div className="p-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Form
      </Button>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
        {stockImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card 
              className="overflow-hidden cursor-pointer group art-card"
              onClick={() => onSelect(`https://source.unsplash.com/500x500/?${encodeURIComponent(image.description)}`)}
            >
              <div className="relative">
                <img  
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  alt={image.alt} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-center font-bold text-sm p-2">Select</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InspirationGallery;