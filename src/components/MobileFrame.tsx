import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-editorial-text font-sans antialiased selection:bg-stone-200 flex flex-col">
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative px-0 sm:px-4 md:px-6">
        {children}
      </div>
    </div>
  );
};

