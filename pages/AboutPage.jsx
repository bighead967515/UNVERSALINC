import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Target, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - InkConnect</title>
        <meta name="description" content="Learn about InkConnect's mission to revolutionize the tattoo industry by connecting talented artists with clients seeking quality and creativity." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-background text-foreground"
      >
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
              About <span className="gradient-text">InkConnect</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-mono">
              We are the premier destination for connecting talented tattoo artists with clients who value creativity and quality.
            </p>
          </div>

          <div className="mt-20 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-card p-8 border-2 border-border cyber-glow-soft" style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'}}>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl mb-2">Our Vision</h3>
                <p className="text-muted-foreground font-mono">To build a global community where every tattoo artist has the platform to showcase their unique work, and every client can easily find the perfect artist for their vision.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-card p-8 border-2 border-border cyber-glow-soft" style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'}}>
                <Target className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl mb-2">Our Mission</h3>
                <p className="text-muted-foreground font-mono">To empower artists with powerful tools to manage their portfolios and connect with clients, while providing a seamless and secure platform for users to discover and book their next tattoo.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-card p-8 border-2 border-border cyber-glow-soft" style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'}}>
                <ShieldCheck className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl mb-2">Our Values</h3>
                <p className="text-muted-foreground font-mono">We operate on principles of Authenticity, Security, and Innovation. Every artist is verified, every transaction is secure, and we are constantly improving our platform to better serve our community.</p>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-24 text-center">
             <h2 className="text-4xl lg:text-5xl mb-4">Meet The <span className="gradient-text">Team</span></h2>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mono">InkConnect is developed and maintained by a passionate team of developers and art enthusiasts dedicated to the craft.</p>
          </div>

        </div>
      </motion.div>
    </>
  );
};

export default AboutPage;