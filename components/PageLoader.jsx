import React from 'react';

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
        <div className="absolute h-16 w-16 rounded-full border-t-4 border-b-4 border-secondary animate-spin" style={{ animationDirection: 'reverse' }}></div>
        <div className="text-primary animate-text-glow font-sans font-bold text-lg">INK..</div>
      </div>
    </div>
  );
};

export default PageLoader;