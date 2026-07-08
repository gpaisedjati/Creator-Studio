import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import type { Episode, Scene } from '../../types';
import { AmbientBackground } from './AmbientBackground';
import { PhoneFrame } from './PhoneFrame';
import { OpeningScene } from './scenes/OpeningScene';
import { ExplanationScene } from './scenes/ExplanationScene';
import { SharedQuestionScene } from './scenes/SharedQuestionScene';
import { useAudioEngine } from './useAudioEngine';

function SceneRenderer({ scene, theme }: { scene: Scene; theme: Episode['theme']; key?: React.Key }) {
  switch (scene.type) {
    case 'opening':
    case 'hook':
    case 'transition':
    case 'closing':
    case 'cta':
      return <OpeningScene scene={scene as any} theme={theme} />;
    case 'question':
    case 'countdown':
    case 'answer':
      return <SharedQuestionScene scene={scene as any} theme={theme} />;
    case 'explanation':
      return <ExplanationScene scene={scene as any} theme={theme} />;
    default:
      return null;
  }
}

export function EpisodePlayer({ episode, onComplete }: { episode: Episode; onComplete: () => void; key?: React.Key }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScene = episode.scenes[currentIndex];

  useAudioEngine(episode, currentScene);

  useEffect(() => {
    if (currentIndex >= episode.scenes.length) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, currentScene?.duration || 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, episode.scenes, onComplete, currentScene]);

  // Calculate current question number
  let currentQuestion = 0;
  for (let i = 0; i <= currentIndex; i++) {
    if (episode.scenes[i]?.type === 'question') {
      currentQuestion++;
    }
  }

  // Check if we are in a question-related scene (question, countdown, answer, explanation)
  const isQuestionSequence = currentScene?.type === 'question' || currentScene?.type === 'countdown' || currentScene?.type === 'answer' || currentScene?.type === 'explanation';
  const isSharedQuestionScene = ['question', 'countdown', 'answer'].includes(currentScene?.type || '');
  const sceneKey = isSharedQuestionScene && 'question' in currentScene 
    ? `shared-${currentScene.question}` 
    : currentScene?.id;

  return (
    <PhoneFrame>
      <AmbientBackground theme={episode.theme} material={episode.metadata?.material} />
      
      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full z-30 pt-12 px-6">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden backdrop-blur-md border border-white/10">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_currentColor]"
            style={{ 
              width: `${Math.max(2, (currentIndex / (episode.scenes.length - 1)) * 100)}%`,
              backgroundColor: episode.theme.colors.primary,
              color: episode.theme.colors.primary
            }}
          />
        </div>

        {/* Question Counter */}
        {isQuestionSequence && episode.metadata?.questionCount && (
          <div className="mt-4 flex justify-between items-center">
            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest shadow-lg">
              Soal {currentQuestion} / {episode.metadata.questionCount}
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 z-10 flex flex-col pt-24 pb-10">
        <AnimatePresence mode="wait">
          {currentScene && (
            <SceneRenderer 
              key={sceneKey} 
              scene={currentScene} 
              theme={episode.theme} 
            />
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}
