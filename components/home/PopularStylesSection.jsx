import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const stylesData = [
  {
    name: "Watercolor",
    slug: "watercolor",
    images: [
      { alt: "Vibrant watercolor hummingbird tattoo on a shoulder blade", description: "Vibrant watercolor hummingbird tattoo on a shoulder blade" },
      { alt: "Abstract watercolor splashes forming a galaxy on a forearm", description: "Abstract watercolor splashes forming a galaxy on a forearm" },
      { alt: "Delicate watercolor poppy flowers on an ankle", description: "Delicate watercolor poppy flowers on an ankle" },
      { alt: "A wolf's face rendered in blue and purple watercolor style", description: "A wolf's face rendered in blue and purple watercolor style" },
    ]
  },
  {
    name: "Realism",
    slug: "realism",
    images: [
      { alt: "Hyper-realistic portrait of a lion on a man's chest", description: "Hyper-realistic portrait of a lion on a man's chest" },
      { alt: "A black and grey realistic rose tattoo on a hand", description: "A black and grey realistic rose tattoo on a hand" },
      { alt: "Photorealistic eye tattoo with a teardrop on a bicep", description: "Photorealistic eye tattoo with a teardrop on a bicep" },
      { alt: "A detailed and realistic skull and clock tattoo sleeve", description: "A detailed and realistic skull and clock tattoo sleeve" },
    ]
  },
  {
    name: "Neo-Traditional",
    slug: "neo-traditional",
    images: [
      { alt: "Ornate neo-traditional owl tattoo with a jewel on a thigh", description: "Ornate neo-traditional owl tattoo with a jewel on a thigh" },
      { alt: "A bold neo-traditional gypsy woman portrait on a calf", description: "A bold neo-traditional gypsy woman portrait on a calf" },
      { alt: "Colorful neo-traditional heart and dagger tattoo", description: "Colorful neo-traditional heart and dagger tattoo" },
      { alt: "A detailed neo-traditional fox surrounded by flowers", description: "A detailed neo-traditional fox surrounded by flowers" },
    ]
  },
  {
    name: "Japanese",
    slug: "japanese",
    images: [
      { alt: "Full back Japanese-style tattoo of a dragon and waves", description: "Full back Japanese-style tattoo of a dragon and waves" },
      { alt: "A koi fish swimming upstream in a Japanese-style sleeve", description: "A koi fish swimming upstream in a Japanese-style sleeve" },
      { alt: "Japanese Hannya mask tattoo with cherry blossoms", description: "Japanese Hannya mask tattoo with cherry blossoms" },
      { alt: "A samurai warrior in a dynamic pose, full-sleeve tattoo", description: "A samurai warrior in a dynamic pose, full-sleeve tattoo" },
    ]
  },
  {
    name: "Blackwork",
    slug: "blackwork",
    images: [
      { alt: "Intricate geometric blackwork pattern covering a full arm", description: "Intricate geometric blackwork pattern covering a full arm" },
      { alt: "Solid blackwork floral design on a sternum", description: "Solid blackwork floral design on a sternum" },
      { alt: "Bold abstract blackwork shapes on a leg", description: "Bold abstract blackwork shapes on a leg" },
      { alt: "A silhouette of a forest in a blackwork style on a forearm", description: "A silhouette of a forest in a blackwork style on a forearm" },
    ]
  },
  {
    name: "Fine Line",
    slug: "fine-line",
    images: [
      { alt: "Single-needle fine line tattoo of a world map on a wrist", description: "Single-needle fine line tattoo of a world map on a wrist" },
      { alt: "Delicate fine line floral bouquet on a collarbone", description: "Delicate fine line floral bouquet on a collarbone" },
      { alt: "A minimalist fine line animal silhouette behind the ear", description: "A minimalist fine line animal silhouette behind the ear" },
      { alt: "Fine line script of a meaningful quote on the ribs", description: "Fine line script of a meaningful quote on the ribs" },
    ]
  },
];

const PopularStylesSection = () => {
  return (
    <section className="py-24 bg-card" id="popular-styles">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-6xl mb-4">Explore Popular <span className="gradient-text">Styles</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover the perfect aesthetic for your next piece of art.</p>
        </motion.div>

        <Tabs defaultValue={stylesData[0].slug} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
              {stylesData.map((style) => (
                <TabsTrigger key={style.slug} value={style.slug} className="py-3 text-base">
                  {style.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          {stylesData.map((style) => (
            <TabsContent key={style.slug} value={style.slug} className="mt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {style.images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group shadow-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
                    >
                      <img  
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        alt={image.alt} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button asChild size="lg">
                    <Link to={`/style/${style.slug}`}>
                      View More {style.name}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default PopularStylesSection;