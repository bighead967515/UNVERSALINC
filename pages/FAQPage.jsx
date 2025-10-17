import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqData = [
  {
    question: "How do I find an artist?",
    answer: "Use the 'Browse Artists' link in the main navigation or the search bar on the homepage. You can filter by location, style, and minimum rating to find the perfect artist for your needs."
  },
  {
    question: "Is InkConnect a free service?",
    answer: "Yes, browsing artists and portfolios is completely free for clients. Artists may subscribe to premium plans for enhanced visibility and tools. The cost of the tattoo is handled directly between you and the artist."
  },
  {
    question: "How do I book an appointment?",
    answer: "Once you've found an artist you'd like to work with, use the 'Contact Artist' button on their profile page. This will open a form for you to send your ideas, reference images, and desired scheduling. The artist will then reply to you directly to coordinate the booking."
  },
  {
    question: "Are the artists on InkConnect verified?",
    answer: "Yes. Every artist on our platform goes through a verification process. We check for a professional portfolio, proper licensing (where applicable), and positive community feedback. Look for the 'Verified' checkmark on their profile."
  },
  {
    question: "What if I have an issue with an artist?",
    answer: "InkConnect is a discovery platform that connects clients and artists. While we are not a party to your direct agreement with an artist, we take community feedback very seriously. You can leave a review on the artist's profile. For serious disputes, please contact us through the Contact page, and we will investigate the matter."
  },
  {
    question: "How do I become a featured artist?",
    answer: "Featured Artists are selected based on a combination of high ratings, positive reviews, portfolio quality, and platform activity. To increase your chances, keep your profile updated, upload high-quality work, and encourage clients to leave reviews after their sessions."
  }
];

const FAQPage = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - InkConnect</title>
        <meta name="description" content="Find answers to frequently asked questions about using InkConnect to find tattoo artists, book appointments, and more." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-background text-foreground"
      >
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-mono">
              Find answers to common questions below.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border-2 border-border rounded-none" style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'}}>
                <AccordionTrigger className="p-6 text-left text-lg hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0 text-muted-foreground font-mono">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.div>
    </>
  );
};

export default FAQPage;