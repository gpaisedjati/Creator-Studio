import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Loader2, RefreshCw, AlertCircle, Clock, LayoutGrid, Users, BarChart, Hash, ChevronRight, Video, ListVideo } from 'lucide-react';
import { EpisodePlayer } from '../components/player/EpisodePlayer';
import { useCreatorStore } from '../store/useCreatorStore';
import { AnimatePresence, motion } from 'motion/react';

const LOADING_STEPS = [
  "Menganalisis materi referensi...",
  "Menyusun struktur naskah...",
  "Merancang komposisi visual...",
  "Memprogram transisi & timing...",
  "Menyiapkan ambient audio...",
  "Finalisasi rendering episode..."
];

const CONTENT_LIBRARY: Record<string, string[]> = {
  "25 Nabi dan Rasul": ["Episode 1 - Nabi Adam", "Episode 2 - Nabi Idris", "Episode 3 - Nabi Nuh", "Episode 4 - Nabi Hud", "Episode 5 - Nabi Shaleh"],
  "Sirah Nabawiyah": ["Episode 1 - Masa Kecil Nabi", "Episode 2 - Turunnya Wahyu Pertama", "Episode 3 - Hijrah ke Madinah"],
  "Aqidah Islam": ["Episode 1 - Rukun Iman", "Episode 2 - Iman kepada Allah"],
  "Akhlak Islami": ["Episode 1 - Jujur", "Episode 2 - Amanah", "Episode 3 - Sabar"],
  "Fiqih Ibadah": ["Episode 1 - Thaharah", "Episode 2 - Wudhu", "Episode 3 - Tayammum"],
  "Shalat": ["Episode 1 - Syarat Sah Shalat", "Episode 2 - Rukun Shalat", "Episode 3 - Sunnah Shalat"],
  "Zakat": ["Episode 1 - Zakat Fitrah", "Episode 2 - Zakat Maal"],
  "Puasa Ramadan": ["Episode 1 - Syarat Puasa", "Episode 2 - Rukun Puasa"],
  "Haji dan Umrah": ["Episode 1 - Syarat Haji", "Episode 2 - Rukun Haji"],
  "Al-Qur'an": ["Episode 1 - Turunnya Al-Qur'an", "Episode 2 - Keutamaan Membaca Al-Qur'an"],
  "Tajwid": ["Episode 1 - Nun Mati", "Episode 2 - Mim Mati"],
  "Asmaul Husna": ["Episode 1 - Ar-Rahman & Ar-Rahim", "Episode 2 - Al-Malik & Al-Quddus"],
  "Hadits Pilihan": ["Episode 1 - Niat", "Episode 2 - Kebersihan"],
  "Doa dalam Islam": ["Episode 1 - Doa Sehari-hari", "Episode 2 - Doa Setelah Shalat"],
  "Sejarah Islam": ["Episode 1 - Masa Kejayaan", "Episode 2 - Masa Kemunduran"],
  "Khulafaur Rasyidin": ["Episode 1 - Abu Bakar", "Episode 2 - Umar bin Khattab", "Episode 3 - Utsman bin Affan", "Episode 4 - Ali bin Abi Thalib"],
  "Sahabat Nabi": ["Episode 1 - Abdurrahman bin Auf", "Episode 2 - Bilal bin Rabah"],
  "Kisah Wanita Mulia": ["Episode 1 - Khadijah", "Episode 2 - Aisyah"],
  "Hari Besar Islam": ["Episode 1 - Idul Fitri", "Episode 2 - Idul Adha", "Episode 3 - Tahun Baru Hijriyah"],
  "Masjid Bersejarah": ["Episode 1 - Masjidil Haram", "Episode 2 - Masjid Nabawi"],
  "Tokoh Islam Dunia": ["Episode 1 - Ibnu Sina", "Episode 2 - Al-Khawarizmi"]
};

const MATERIALS = Object.keys(CONTENT_LIBRARY);

const QUESTION_COUNTS = [5, 10, 15, 20];

export function CreatorMode() {
  const { currentEpisode, isGenerating, error, isPlaying, setIsPlaying, generateEpisode } = useCreatorStore();
  
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [episodeName, setEpisodeName] = useState(CONTENT_LIBRARY[MATERIALS[0]][0]);
  const [questionCount, setQuestionCount] = useState(5);
  
  const [key, setKey] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  // Update episodeName selection when material changes
  useEffect(() => {
    setEpisodeName(CONTENT_LIBRARY[material][0]);
  }, [material]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = () => {
    if (!material.trim() || !episodeName.trim()) return;
    generateEpisode({
      material,
      episodeName,
      questionCount
    });
  };

  const handlePlay = () => {
    if (!currentEpisode) return;
    setKey(k => k + 1);
    setIsPlaying(true);
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      return `± ${minutes} menit ${seconds} detik`;
    }
    return `± ${seconds} detik`;
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full overflow-hidden bg-black">
      
      {/* Settings / Controls Sidebar */}
      <AnimatePresence initial={false}>
        {!isPlaying && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="border-b md:border-r border-neutral-900/80 bg-neutral-950/80 backdrop-blur-3xl z-40 shrink-0 overflow-hidden shadow-[20px_0_40px_rgba(0,0,0,0.5)] flex flex-col w-full md:w-[400px] lg:w-[450px]"
          >
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10">
              
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#10B981]/10 text-[#D4AF37] mb-5 border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-serif text-white mb-3 tracking-wide drop-shadow-sm">Creator Studio</h1>
                <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                  Strategi konten cerdas didukung AI. Tentukan parameter, dan biarkan sistem merancang episode sempurna.
                </p>
              </div>
              
              {!currentEpisode && !isGenerating && (
                <div className="space-y-8">
                  {/* Material Selection */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                      <Video className="w-3.5 h-3.5" /> Materi
                    </label>
                    <select 
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl text-white font-medium shadow-inner backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none transition-all"
                    >
                      {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  {/* Episode Selection */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                      <ListVideo className="w-3.5 h-3.5" /> Episode
                    </label>
                    <select 
                      value={episodeName}
                      onChange={(e) => setEpisodeName(e.target.value)}
                      className="w-full p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl text-white font-medium shadow-inner backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none transition-all"
                    >
                      {CONTENT_LIBRARY[material].map(ep => <option key={ep} value={ep}>{ep}</option>)}
                      {!CONTENT_LIBRARY[material].includes(episodeName) && episodeName !== '' && (
                        <option value={episodeName}>{episodeName}</option>
                      )}
                    </select>
                    
                    <button
                      onClick={() => {
                        const newEpNumber = CONTENT_LIBRARY[material].length + 1;
                        setEpisodeName(`Episode ${newEpNumber} - Topik Kustom (AI Generate)`);
                      }}
                      className="w-full py-3 mt-2 rounded-xl text-xs font-semibold bg-neutral-900/40 text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Buat Episode Baru
                    </button>
                  </div>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                        <Hash className="w-3.5 h-3.5" /> Jumlah Soal
                      </label>
                      <select 
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="w-full p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl text-white font-medium shadow-inner backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none transition-all"
                      >
                        {QUESTION_COUNTS.map(q => <option key={q} value={q}>{q} Soal</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-950/40 border border-red-900/50 rounded-2xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-400 text-sm font-bold mb-1">Generation Failed</h4>
                      <p className="text-red-400/80 text-xs leading-relaxed">{error}</p>
                      <button 
                        onClick={handleGenerate}
                        className="mt-3 text-xs text-red-300 hover:text-white flex items-center gap-1 transition-colors font-medium"
                      >
                        <RefreshCw className="w-3 h-3" /> Coba Lagi
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Creator Summary */}
              {currentEpisode && !isGenerating && !error && currentEpisode.metadata && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h3 className="text-white text-lg font-serif mb-1">{currentEpisode.metadata.title}</h3>
                    <p className="text-[#D4AF37] text-xs font-semibold tracking-wide uppercase">{currentEpisode.metadata.material}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-900/40 border border-neutral-800/50 p-3 rounded-xl">
                      <div className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Total Soal</div>
                      <div className="text-white text-sm font-bold">{currentEpisode.metadata.questionCount} Soal</div>
                    </div>
                    <div className="bg-neutral-900/40 border border-neutral-800/50 p-3 rounded-xl">
                      <div className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Topik</div>
                      <div className="text-white text-sm font-bold truncate">{currentEpisode.metadata.episodeName}</div>
                    </div>
                    <div className="bg-neutral-900/40 border border-neutral-800/50 p-3 rounded-xl">
                      <div className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Est. Durasi</div>
                      <div className="text-[#10B981] text-sm font-bold">{formatDuration(currentEpisode.metadata.estimatedDuration)}</div>
                    </div>
                    <div className="bg-neutral-900/40 border border-neutral-800/50 p-3 rounded-xl">
                      <div className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Voice Profile</div>
                      <div className="text-white text-sm font-bold truncate">{currentEpisode.metadata.voice}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl flex items-center gap-4 shadow-inner backdrop-blur-sm">
                    <div 
                      className="w-10 h-10 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] ring-2 ring-white/10 shrink-0" 
                      style={{ background: `linear-gradient(to bottom right, ${currentEpisode.theme.colors.primary}, ${currentEpisode.theme.colors.accent})` }}
                    />
                    <div className="min-w-0">
                      <div className="text-neutral-500 text-[10px] uppercase tracking-wider mb-0.5">Visual Theme</div>
                      <div className="text-white text-sm font-semibold tracking-wide truncate">{currentEpisode.theme.name}</div>
                      <div className="text-neutral-400 text-xs mt-0.5 font-medium truncate">{currentEpisode.theme.vibe}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons Pinned at Bottom */}
            <div className="p-6 md:p-8 bg-neutral-950/90 border-t border-neutral-900/80 shrink-0">
              {currentEpisode && !isGenerating && !error ? (
                <div className="space-y-3">
                  <button
                    onClick={handlePlay}
                    className="w-full py-4.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-[length:200%_auto] hover:bg-right text-black rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transform hover:-translate-y-1"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span className="tracking-widest uppercase text-sm">Play Episode</span>
                  </button>
                  <button
                    onClick={() => generateEpisode({ material, episodeName, questionCount })}
                    className="w-full py-3 text-neutral-500 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    Re-generate
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !material.trim() || !episodeName.trim()}
                  className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Menganalisis...</>
                  ) : (
                    <><Video className="w-5 h-5 text-[#D4AF37]" /> Mulai Produksi Episode</>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Studio Canvas Area */}
      <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden h-full w-full">
        {/* Minimalist Studio Lighting Grid - Only visible when not playing */}
        {!isPlaying && (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-[#D4AF37]/5 to-[#10B981]/5 rounded-full blur-[150px] pointer-events-none" />
          </>
        )}
        
        {isPlaying && currentEpisode ? (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black z-50"
            >
              <EpisodePlayer key={key} episode={currentEpisode} onComplete={() => setIsPlaying(false)} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 relative z-10 max-w-sm hidden md:block" // Hidden on mobile to focus on sidebar
          >
            {isGenerating ? (
              <div className="space-y-6">
                <div className="w-28 h-28 mx-auto rounded-[2rem] bg-gradient-to-br from-[#D4AF37]/20 to-[#10B981]/20 border border-[#D4AF37]/30 backdrop-blur-xl flex items-center justify-center text-[#D4AF37] shadow-[0_20px_50px_rgba(212,175,55,0.2)] animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent animate-[spin_3s_linear_infinite]" />
                  <Loader2 className="w-12 h-12 animate-spin relative z-10" />
                </div>
                
                {/* Progress Indicator */}
                <div className="space-y-3">
                  <div className="h-1 w-48 mx-auto bg-neutral-900 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#10B981]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <motion.p 
                    key={loadingStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#D4AF37] text-sm font-medium tracking-wide"
                  >
                    {LOADING_STEPS[loadingStep]}
                  </motion.p>
                </div>
              </div>
            ) : (
              <div className="w-28 h-28 mx-auto rounded-[2rem] bg-gradient-to-br from-neutral-900/80 to-black/80 border border-neutral-800/80 backdrop-blur-xl flex items-center justify-center text-neutral-600 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                <Sparkles className="w-10 h-10 opacity-50" />
              </div>
            )}
            
            {!isGenerating && (
              <div className="space-y-3">
                <h3 className="text-xl font-serif text-white tracking-wide">
                  {currentEpisode ? "Studio Ready" : "Canvas Kosong"}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {currentEpisode 
                        ? "Episode berhasil dirangkai! Silakan putar video di panel samping." 
                        : "Sistem menunggu instruksi konten Anda di panel strategi."}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
