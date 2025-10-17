import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowItWorksSection = () => {
  const howItWorksSteps = [
    { 
      icon: Lightbulb, 
      title: "Post Your Idea", 
      description: "Submit your tattoo concept, including style, placement, and reference images. It's free and easy!" 
    },
    { 
      icon: Users, 
      title: "Receive Proposals", 
      description: "Talented artists interested in your idea will send you proposals, design mockups, and price estimates." 
    },
    { 
      icon: Award, 
      title: "Choose Your Artist", 
      description: "Review portfolios and proposals to select the perfect artist to bring your vision to life and book your session." 
    },
  ];

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl mb-4">How It <span className="gradient-text">Works</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Getting your new tattoo is a simple three-step process.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-10">
          {howItWorksSteps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: index * 0.15 }} 
              className="bg-background p-8 text-center border border-border rounded-xl soft-glow"
            >
              <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <step.icon className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-background text-primary rounded-full flex items-center justify-center font-bold text-2xl border-2 border-primary">
                      {index + 1}
                  </div>
              </div>
              <h3 className="text-2xl mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6, delay: 0.3 }} 
          className="text-center mt-20"
        >
          <Button asChild size="lg">
            <Link to="/dream-tattoo">Get Started Now</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;