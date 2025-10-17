import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Phone, Mail, Briefcase } from 'lucide-react';

const ContactBooking = ({ artist }) => {

  return (
    <div className="py-12 grid md:grid-cols-5 gap-12">
      <div className="md:col-span-2 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#262626] p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4 text-white">Services Offered</h3>
          <ul className="space-y-3">
            {artist.services && artist.services.map((service, index) => (
              <li key={index} className="flex items-start">
                <Briefcase className="w-5 h-5 text-[#FF5722] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">{service.name}</p>
                  <p className="text-sm text-[#A3A3A3]">{service.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#262626] p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4 text-white">Contact & Hours</h3>
          <ul className="space-y-3 text-[#A3A3A3]">
            <li className="flex items-center"><Clock className="w-5 h-5 text-[#FF5722] mr-3" /> {artist.hours}</li>
            {artist.contact && <>
              <li className="flex items-center"><Phone className="w-5 h-5 text-[#FF5722] mr-3" /> {artist.contact.phone}</li>
              <li className="flex items-center"><Mail className="w-5 h-5 text-[#FF5722] mr-3" /> {artist.contact.email}</li>
            </>}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="md:col-span-3 bg-[#262626] p-8 rounded-lg flex flex-col items-center justify-center text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Ready to book?</h2>
        <p className="text-muted-foreground mb-6">Click the "Book Appointment" button above to start your booking request and secure your spot with the artist.</p>
        <p className="text-sm text-muted-foreground/50">Our new streamlined booking process makes it easier than ever to connect with your favorite artists.</p>
      </motion.div>
    </div>
  );
};

export default ContactBooking;