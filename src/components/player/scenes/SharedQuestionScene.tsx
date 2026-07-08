import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import type { QuestionScene, CountdownScene, AnswerScene } from '../../../types';
import { cn } from '../../../lib/utils';
import { CheckCircle2, Sparkles } from 'lucide-react';

type SceneType = QuestionScene | CountdownScene | AnswerScene;

export function SharedQuestionScene({ scene, theme }: { scene: SceneType; theme: any }) {
  const isCountdown = scene.type === 'countdown';
  const isAnswer = scene.type === 'answer';
  const [timeLeft, setTimeLeft] = useState((scene as CountdownScene).seconds || 0);

  useEffect(() => {
    if (scene.type === 'countdown') {
      setTimeLeft((scene as CountdownScene).seconds);
    }
  }, [scene.id, scene.type]);

  useEffect(() => {
    if (scene.type !== 'countdown' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, scene.type]);

  // Keep a clean crossfade exit only if the component actually unmounts
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full flex-col p-8 pt-20 pb-12 absolute inset-0 z-20"
    >
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full relative">
        {/* Placeholder for Countdown to prevent layout shift */}
        <div className="h-32 mb-4 flex justify-center items-end">
          <AnimatePresence>
            {isCountdown && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -20 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                className="flex items-center justify-center z-30"
              >
                <div 
                  className="relative flex h-24 w-24 items-center justify-center rounded-full bg-black/80 backdrop-blur-md ring-2 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                  style={{ ringColor: `${theme.colors.primary}80`, boxShadow: `0 0 40px ${theme.colors.primary}40` }}
                >
                  <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle
                      cx="48" cy="48" r="42" fill="none" stroke={theme.colors.primary} strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - timeLeft / ((scene as CountdownScene).seconds || 1))}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                      style={{ filter: `drop-shadow(0 0 10px ${theme.colors.primary})` }}
                    />
                  </svg>
                  <motion.span 
                    key={timeLeft}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5, position: 'absolute' }}
                    transition={{ duration: 0.5 }}
                    className="absolute font-serif text-3xl leading-none font-bold text-white drop-shadow-lg"
                  >
                    {timeLeft}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.h2 
          className="font-serif text-[2rem] leading-[1.3] font-bold text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] text-center mb-10 text-balance transition-opacity duration-500"
          style={{ opacity: isAnswer ? 0.6 : 1 }}
        >
          {scene.question}
        </motion.h2>
        
        <div className="flex flex-col gap-4 relative">
          {scene.options?.map((option, index) => {
            const isCorrect = isAnswer && index === (scene as AnswerScene).correctAnswerIndex;
            const isFaded = isAnswer && !isCorrect;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative overflow-hidden rounded-3xl border p-5 backdrop-blur-2xl flex items-center justify-between transition-all duration-700 shadow-[0_15px_30px_rgba(0,0,0,0.4)]",
                  isCorrect ? "z-20 scale-[1.05]" : "scale-100",
                  isFaded ? "border-white/5 bg-black/50 opacity-30 grayscale shadow-none scale-95" : "border-white/10 bg-gradient-to-r from-black/60 to-black/40"
                )}
                style={isCorrect ? { 
                  borderColor: theme.colors.accent, 
                  backgroundColor: `${theme.colors.accent}44`,
                  boxShadow: `0 0 60px ${theme.colors.accent}80, inset 0 0 20px ${theme.colors.accent}40`
                } : {}}
              >
                {/* Continuous Pulse for correct answer */}
                {isCorrect && (
                  <motion.div 
                    className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  />
                )}
                
                <div className="flex items-center gap-5 relative z-10">
                  <div 
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold shadow-inner transition-colors duration-500 border",
                      isCorrect ? "text-white shadow-[0_0_15px_currentColor]" : "text-lg"
                    )}
                    style={isCorrect ? {
                      backgroundImage: `linear-gradient(to bottom right, ${theme.colors.accent}, ${theme.colors.accent}99)`,
                      borderColor: theme.colors.accent
                    } : { 
                      backgroundColor: `${theme.colors.primary}30`, 
                      borderColor: `${theme.colors.primary}50`,
                      color: theme.colors.primary 
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={cn(
                    "font-sans text-xl tracking-wide transition-all duration-500",
                    isCorrect ? "text-white font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" : (isFaded ? "text-white/60 font-medium" : "text-white/90 font-medium")
                  )}>
                    {option}
                  </span>
                </div>

                {/* Success Icon */}
                <AnimatePresence>
                  {isCorrect && (
                    <motion.div
                      className="relative z-10 flex items-center gap-2"
                      initial={{ scale: 0, rotate: -180, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: 90, opacity: 0 }}
                      transition={{ type: "spring", delay: 0.3, bounce: 0.6, stiffness: 200 }}
                    >
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Sparkles className="w-5 h-5" style={{ color: theme.colors.accent, filter: `drop-shadow(0 0 10px ${theme.colors.accent})` }} />
                      </motion.div>
                      <CheckCircle2 className="w-8 h-8" style={{ color: theme.colors.accent, filter: `drop-shadow(0 0 15px ${theme.colors.accent})` }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

        </div>
      </div>
    </motion.div>
  );
}
