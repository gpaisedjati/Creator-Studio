import { motion } from 'motion/react';
import type { ExplanationScene as ExplanationSceneType } from '../../../types';

export function ExplanationScene({ scene, theme }: { scene: ExplanationSceneType; theme: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full flex-col items-center justify-center p-8 text-center absolute inset-0 z-20"
    >
      <div 
        className="relative rounded-[2.5rem] border bg-gradient-to-br from-[#0F172A]/90 to-black/90 p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl ring-1 ring-white/5 max-w-sm w-full"
        style={{ borderColor: `${theme.colors.primary}50` }}
      >
        <div 
          className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border backdrop-blur-xl"
          style={{ 
            backgroundImage: `linear-gradient(to right, ${theme.colors.primary}33, ${theme.colors.accent}33)`,
            borderColor: `${theme.colors.primary}66`,
            boxShadow: `0 0 20px ${theme.colors.primary}33`
          }}
        >
          <span 
            className="font-sans text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: theme.colors.primary }}
          >
            Pembahasan
          </span>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 font-sans text-2xl leading-relaxed text-white/95 font-medium text-balance drop-shadow-md"
        >
          {scene.text}
        </motion.p>
      </div>
    </motion.div>
  );
}
