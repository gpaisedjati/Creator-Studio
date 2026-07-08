import React from 'react';
import { Sparkles, Video, Settings, History } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCreatorStore } from '../../store/useCreatorStore';
import { AnimatePresence, motion } from 'motion/react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isPlaying = useCreatorStore((state) => state.isPlaying);

  return (
    <div className="flex h-screen w-full bg-neutral-950 text-neutral-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <AnimatePresence initial={false}>
        {!isPlaying && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 md:w-64 border-r border-neutral-900 bg-neutral-950/80 backdrop-blur-xl flex flex-col shrink-0 z-50 overflow-hidden"
          >
            <div className="w-20 md:w-64 flex flex-col h-full">
              <div className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 border-b border-neutral-900/50 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#10B981]/20 flex items-center justify-center text-[#D4AF37]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-serif font-medium text-lg hidden md:block tracking-wide">Studio AI</span>
              </div>
              
              <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                <NavItem icon={<Video className="w-5 h-5" />} label="Creator Mode" active />
                <NavItem icon={<History className="w-5 h-5" />} label="My Episodes" />
              </nav>
              
              <div className="p-4 border-t border-neutral-900/50 shrink-0">
                <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-black">
        {children}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-colors group",
        active 
          ? "bg-neutral-800 text-white" 
          : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
      )}
      title={label}
    >
      <div className={cn("flex-shrink-0", active ? "text-emerald-400" : "group-hover:text-emerald-400 transition-colors")}>
        {icon}
      </div>
      <span className="hidden md:block font-medium text-sm">{label}</span>
    </button>
  );
}
