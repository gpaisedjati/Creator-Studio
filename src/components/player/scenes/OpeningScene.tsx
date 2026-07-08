import { motion } from 'motion/react';
import type { TextScene } from '../../../types';
import { cn } from '../../../lib/utils';

export function OpeningScene({ scene, theme }: { scene: TextScene; theme: any }) {
  const isHook = scene.type === 'hook';
  const isClosing = scene.type === 'closing' || scene.type === 'cta';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full flex-col items-center justify-center p-8 text-center absolute inset-0 z-20"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <h1 className={cn(
          "font-serif font-bold leading-[1.15] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-tight",
          isHook ? "text-5xl text-white" : "text-6xl text-transparent bg-clip-text",
          isClosing ? "text-5xl text-white" : ""
        )}
        style={!isHook && !isClosing ? { backgroundImage: `linear-gradient(to bottom, #ffffff, ${theme.colors.primary})` } : {}}
        >
          {scene.text}
        </h1>
        {scene.subtext && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={cn(
            "mt-8 font-sans font-medium tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] leading-relaxed text-balance",
            isHook ? "text-2xl" : "text-xl text-neutral-300 uppercase tracking-[0.2em]",
            isClosing ? "text-2xl" : ""
          )}
          style={(isHook || isClosing) ? { color: theme.colors.primary } : {}}
          >
            {scene.subtext}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
