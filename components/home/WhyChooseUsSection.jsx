import React from 'react';
import { motion } from 'framer-motion';
import { Users, Palette, MessageSquare, ShieldCheck } from 'lucide-react';

const WhyChooseUsSection = () => {
  const benefits = [
    { icon: Users, title: "Access Elite Artists", description: "Connect with a curated network of professional, reviewed tattoo artists." },
    { icon: Palette, title: "Browse Portfolios", description: "Explore high-resolution portfolios to find the perfect design for your new ink." },
    { icon: MessageSquare, title: "Direct Communication", description: "Communicate securely with artists to share your ideas and book sessions." },
    { icon: ShieldCheck, title: "Verified & Reviewed", description: "Choose with confidence. Read client reviews and see artist verifications." },
  ];
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl mb-4">Why Choose <span className="gradient-text">InkConnect?</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">The best platform for artists and clients.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center p-6 bg-background rounded-xl border border-border soft-glow">
              <div className="inline-block p-4 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
                <benefit.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl text-foreground mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;