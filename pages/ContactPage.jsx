import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - InkConnect</title>
        <meta name="description" content="Get in touch with the InkConnect team." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl p-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]"
      >
        <h1 className="text-5xl font-bold mb-4 gradient-text">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          This page is currently under construction. 🚧 <br/> Our contact form and details will be available here very soon.
        </p>
      </motion.div>
    </>
  );
};

export default ContactPage;