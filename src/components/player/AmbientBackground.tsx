import { motion, AnimatePresence } from 'motion/react';
import { Theme } from '../../types';
import { useState, useEffect } from 'react';
import { BackgroundEngine } from '../../engines/BackgroundEngine';

const getTopicFallback = (topic?: string) => {
  const norm = (topic || '').toLowerCase();
  
  if (
    norm.includes('nabi') || 
    norm.includes('rasul') || 
    norm.includes('sirah') || 
    norm.includes('sahabat') || 
    norm.includes('khulafaur') || 
    norm.includes('wanita')
  ) {
    // Royal Crimson & Deep Violet
    return {
      gradient: 'bg-gradient-to-br from-[#2a0815] via-[#14020b] to-[#040003]',
      accentColor: 'text-amber-500/10',
      glowColor: 'bg-red-500/10',
      symbol: 'prophets'
    };
  }
  
  if (
    norm.includes('quran') || 
    norm.includes('tajwid') || 
    norm.includes('husna') || 
    norm.includes('doa') || 
    norm.includes('hadits') || 
    norm.includes('ramadan') || 
    norm.includes('puasa')
  ) {
    // Deep Emerald & Forest Teal
    return {
      gradient: 'bg-gradient-to-br from-[#022c22] via-[#021b14] to-[#010a08]',
      accentColor: 'text-yellow-400/10',
      glowColor: 'bg-emerald-500/10',
      symbol: 'quran'
    };
  }
  
  if (
    norm.includes('haji') || 
    norm.includes('umrah') || 
    norm.includes('masjid') || 
    norm.includes('sejarah') || 
    norm.includes('tokoh')
  ) {
    // Warm Amber & Charcoal Black
    return {
      gradient: 'bg-gradient-to-br from-[#3b1c03] via-[#1a0c01] to-[#050200]',
      accentColor: 'text-amber-500/10',
      glowColor: 'bg-amber-600/10',
      symbol: 'haji'
    };
  }
  
  // Default/Aqidah/Akhlak/Fiqih/Shalat/Zakat: Deep Indigo & Royal Sapphire
  return {
    gradient: 'bg-gradient-to-br from-[#0c122c] via-[#050819] to-[#010207]',
    accentColor: 'text-violet-400/10',
    glowColor: 'bg-violet-600/10',
    symbol: 'general'
  };
};

export function AmbientBackground({ theme, material }: { theme: Theme, material?: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    if (material) {
      const url = BackgroundEngine.getBackgroundUrl(material);
      if (url) {
        BackgroundEngine.preloadImage(url).then((loaded) => {
          if (loaded) {
            setImgSrc(url);
            setUseFallback(false);
          } else {
            setImgSrc(null);
            setUseFallback(true);
          }
        });
      } else {
        setImgSrc(null);
        setUseFallback(true);
      }
    } else {
      setImgSrc(null);
      setUseFallback(true);
    }
  }, [material]);

  const fallback = getTopicFallback(material);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {/* Render real uploaded image if successfully preloaded */}
        {!useFallback && imgSrc ? (
          <motion.div
            key={`img-${imgSrc}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={imgSrc} 
              alt={material}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Dark overlay for readability (35-50% dark) */}
            <div className="absolute inset-0 bg-black/45" />
            {/* Fine vignette at the edges */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
          </motion.div>
        ) : (
          /* Render breathtaking fallback procedural canvas if image is not found */
          <motion.div
            key={`fallback-${material || 'default'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`absolute inset-0 w-full h-full ${fallback.gradient}`}
          >
            {/* Ambient light glow orb in center */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full filter blur-[100px] pointer-events-none opacity-40 ${fallback.glowColor}`} />

            {/* Glowing SVG Symbolic Ornaments based on Islamic Category */}
            {fallback.symbol === 'general' || fallback.symbol === 'prophets' ? (
              <svg 
                className={`w-72 h-72 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] animate-[spin_180s_linear_infinite] ${fallback.accentColor}`} 
                viewBox="0 0 100 100"
                fill="none"
              >
                {/* Islamic Geometric Star (Rub el Hizb) */}
                <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="1.2" transform="rotate(0 50 50)" />
                <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="1.2" transform="rotate(45 50 50)" />
                <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="1.2" transform="rotate(22.5 50 50)" />
                <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="1.2" transform="rotate(67.5 50 50)" />
                <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />
              </svg>
            ) : fallback.symbol === 'quran' ? (
              <svg 
                className={`w-72 h-72 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] ${fallback.accentColor}`} 
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                {/* Elegant Crescent Moon & Star */}
                <path d="M42 22 A28 28 0 1 0 78 58 A30 30 0 1 1 42 22 Z" />
                <path d="M66 36 L68.5 41 L74 41.5 L70 45 L71 50.5 L66 47.5 L61 50.5 L62 45 L58 41.5 L63.5 41 Z" />
              </svg>
            ) : (
              <svg 
                className={`w-80 h-80 absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.05] ${fallback.accentColor}`} 
                viewBox="0 0 120 120"
                fill="currentColor"
              >
                {/* Majestic Dome and Minaret outlines */}
                <path d="M60 35 C60 18 50 10 50 10 C50 10 40 18 40 35 L18 35 L18 120 L82 120 L82 35 Z" />
                <path d="M10 55 L14 55 L14 120 L10 120 Z" />
                <path d="M90 55 L94 55 L94 120 L90 120 Z" />
              </svg>
            )}

            {/* Readability vignettes */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Optional cinematic film grain if theme demands it */}
      {theme.cinematicStyle?.toLowerCase().includes('cinematic') && (
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      )}
    </div>
  );
}
