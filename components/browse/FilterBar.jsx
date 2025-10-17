import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Star, X, CalendarDays, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const tattooStyles = [
  'All', 'Cover-Up', 'Neo-Traditional', 'Blackwork', 'Watercolor', 'Realism', 'Traditional', 
  'Japanese', 'Minimalist', 'Dotwork', 'Tribal', 'Geometric', 'Biomechanical', 'Glitch Art', 'Holographic'
];

const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'distance', label: 'Distance' },
];

const FilterBar = ({ onFilterChange, filters }) => {
  const { toast } = useToast();

  const handleInputChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value === 'All' ? '' : value });
  };

  const handleSliderChange = (value) => {
    onFilterChange({ ...filters, rating: value[0] });
  };

  const handleCheckboxChange = (name, checked) => {
    onFilterChange({ ...filters, [name]: checked });
  };
  
  const resetFilters = () => {
    onFilterChange({
      location: '',
      style: '',
      rating: 0,
      sortBy: 'rating',
      verifiedOnly: false,
    });
  };

  const handleAvailabilityClick = () => {
    toast({
      title: "🚧 Feature Not Available",
      description: "Artist availability search is currently under development. Please check back later.",
      variant: 'cyber'
    });
  };

  const FilterControls = () => (
    <div className="space-y-8 p-2">
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          name="location" 
          placeholder="City, State, or Zip"
          value={filters.location}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="style">Tattoo Style</Label>
        <Select onValueChange={(value) => handleSelectChange('style', value)} value={filters.style || 'All'}>
          <SelectTrigger id="style">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            {tattooStyles.map(style => (
              <SelectItem key={style} value={style}>{style}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sortBy">Sort By</Label>
        <Select onValueChange={(value) => handleSelectChange('sortBy', value)} value={filters.sortBy}>
          <SelectTrigger id="sortBy">
            <SelectValue placeholder="Sort artists by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <Label>Minimum Rating</Label>
        <div className="flex items-center gap-4">
          <Star className="w-6 h-6 text-primary" />
          <Slider
            value={[filters.rating]}
            onValueChange={handleSliderChange}
            max={5}
            step={0.5}
          />
          <span className="font-mono text-sm font-semibold w-12 text-right">{filters.rating.toFixed(1)}+</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
            id="verifiedOnly" 
            checked={filters.verifiedOnly}
            onCheckedChange={(checked) => handleCheckboxChange('verifiedOnly', checked)}
        />
        <Label htmlFor="verifiedOnly" className="font-normal">Show Verified Artists Only</Label>
      </div>
      <div>
        <Button variant="outline" className="w-full justify-start" onClick={handleAvailabilityClick}>
          <CalendarDays className="w-4 h-4 mr-2"/>
          Check Availability
        </Button>
      </div>
      <div className="flex justify-end pt-4">
        <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground hover:text-destructive">
          <X className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border-2 border-border p-1 rounded-none"
      style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'}}
    >
      <div className="bg-card p-4">
        <div className="hidden md:block">
          <h3 className="text-2xl mb-6 text-primary">Filters</h3>
          <FilterControls />
        </div>
        <div className="md:hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value="filters" className="border-b-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  Filters
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <FilterControls />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;