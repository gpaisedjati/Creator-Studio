import { create } from 'zustand';
import type { Episode, Theme } from '../types';

interface CreatorState {
  // Current active episode
  currentEpisode: Episode | null;
  
  // App states
  isGenerating: boolean;
  isPlaying: boolean;
  error: string | null;
  
  // Actions
  setCurrentEpisode: (episode: Episode | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  generateEpisode: (params: { material: string; episodeName: string; questionCount: number }) => Promise<void>;
  reset: () => void;
}

export const useCreatorStore = create<CreatorState>((set) => ({
  currentEpisode: null,
  isGenerating: false,
  isPlaying: false,
  error: null,
  
  setCurrentEpisode: (episode) => set({ currentEpisode: episode }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  generateEpisode: async (params) => {
    set({ isGenerating: true, error: null, currentEpisode: null, isPlaying: false });
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate episode');
      }
      
      const episode: Episode = await response.json();
      set({ currentEpisode: episode, isGenerating: false, isPlaying: true });
    } catch (err: any) {
      set({ error: err.message, isGenerating: false });
    }
  },
  
  reset: () => set({ currentEpisode: null, isGenerating: false, isPlaying: false, error: null }),
}));

