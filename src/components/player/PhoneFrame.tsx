import React from 'react';

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex h-[90vh] w-auto aspect-[9/16] overflow-hidden rounded-[36px] border-[10px] border-neutral-900/90 bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10 md:h-[95vh] md:max-h-[1000px] md:rounded-[56px] md:border-[14px] transition-all duration-700 ease-out">
      {/* Notch / Dynamic Island */}
      <div className="absolute top-0 left-1/2 z-50 h-6 w-32 md:h-8 md:w-40 -translate-x-1/2 rounded-b-3xl bg-neutral-900 shadow-[inset_0_-2px_4px_rgba(255,255,255,0.05)]"></div>
      
      {/* Screen Content Container with Safe Area */}
      <div className="relative h-full w-full overflow-hidden flex flex-col">
        {/* Top Safe Area */}
        <div className="h-12 md:h-14 w-full shrink-0 z-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        
        {/* Main Fluid Content */}
        <div className="flex-1 relative w-full h-full">
          {children}
        </div>
        
        {/* Bottom Safe Area */}
        <div className="h-10 md:h-12 w-full shrink-0 z-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none flex items-end justify-center pb-3">
          <div className="w-1/3 h-1.5 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
