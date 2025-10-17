import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const DashboardLayout = ({ children, sidebarNavItems, pageTitle, pageDescription, headerContent }) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle} | Universal Ink Dashboard</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1">
            <DashboardSidebar navItems={sidebarNavItems} />
          </aside>
          <main className="lg:col-span-3">
            {headerContent && (
              <div className="flex justify-end mb-6">
                {headerContent}
              </div>
            )}
            {children}
          </main>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardLayout;