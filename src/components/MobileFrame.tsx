import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F4F1EA] flex justify-center text-editorial-text font-sans antialiased selection:bg-stone-200">
      {/* Real App Container: Full-width on mobile, elegant centered card on desktop */}
      <div className="w-full max-w-lg min-h-screen bg-[#FCFAF7] shadow-2xl md:border-x md:border-editorial-border flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};

