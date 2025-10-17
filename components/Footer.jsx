
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      variant: 'cyber'
    });
  };

  const footerLinks = {
    'Company': [
      { name: 'About Us', path: '/about' },
      { name: 'Community', path: '/community'},
      { name: 'Pricing', path: '/pricing' },
    ],
    'Support': [
      { name: 'Contact', path: '/contact' },
      { name: 'FAQ', path: '/faq'},
      { name: 'Tattoo Aftercare', path: '/tattoo-aftercare' },
    ],
    'Legal': [
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms-of-service' },
      { name: 'Rights & Responsibilities', path: '/rights-responsibilities' },
    ]
  };

  const socialLinks = [
    { icon: Instagram, action: () => handleFeatureClick('instagram'), label: 'Instagram' },
    { icon: Facebook, action: () => handleFeatureClick('facebook'), label: 'Facebook' },
    { icon: Twitter, action: () => handleFeatureClick('twitter'), label: 'Twitter' },
  ];

  return (
    <footer className="bg-background cyber-border-t mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="col-span-1 lg:col-span-1">
             <Link to="/" className="text-4xl font-black gradient-text tracking-widest">
                UNIVERSAL
              </Link>
              <p className="font-mono text-muted-foreground mt-4 text-sm max-w-xs">
                Connecting the world's best tattoo artists with clients who appreciate true art.
              </p>
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1, color: 'hsl(var(--primary))' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={social.action}
                    className="text-muted-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.button>
                ))}
              </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h4 className="text-lg text-primary mb-4 font-bold">{title}</h4>
              <nav className="flex flex-col space-y-3">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="font-mono text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground font-mono text-xs">
            © {new Date().getFullYear()} Universal Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  