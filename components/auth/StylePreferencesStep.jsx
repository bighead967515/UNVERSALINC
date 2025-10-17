import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const styles = [
  { name: 'Watercolor', slug: 'watercolor' },
  { name: 'Realism', slug: 'realism' },
  { name: 'Neo-Traditional', slug: 'neo-traditional' },
  { name: 'Japanese', slug: 'japanese' },
  { name: 'Blackwork', slug: 'blackwork' },
  { name: 'Fine Line', slug: 'fine-line' },
  { name: 'Tribal', slug: 'tribal' },
  { name: 'American Traditional', slug: 'american-traditional' },
  { name: 'Geometric', slug: 'geometric' },
];

const StylePreferencesStep = ({ onComplete, isLoading }) => {
  const [selectedStyles, setSelectedStyles] = useState([]);

  const toggleStyle = (slug) => {
    setSelectedStyles((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = () => {
    onComplete(selectedStyles);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black mb-2">Your <span className="gradient-text">Style</span></h1>
        <p className="text-muted-foreground font-mono">Select a few styles you love. This helps us personalize your experience.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {styles.map((style) => {
          const isSelected = selectedStyles.includes(style.slug);
          return (
            <motion.div
              key={style.slug}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleStyle(style.slug)}
              className={cn(
                'relative p-4 border-2 rounded-lg cursor-pointer text-center font-semibold transition-all duration-200',
                isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted/50 hover:border-primary/50'
              )}
            >
              {style.name}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : 'Complete Sign Up'}
      </Button>
    </div>
  );
};

export default StylePreferencesStep;