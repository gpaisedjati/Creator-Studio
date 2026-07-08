/**
 * AI Experience Architecture - AI Engine
 * Responsible for generating the content of the episode (Ideation, Scripting, Questions).
 */

import type { Episode, Theme } from '../types';

export class AIEngine {
  async generateEpisode(topic: string, theme: Theme): Promise<Episode> {
    throw new Error('Not implemented yet in Sprint 1');
  }
}
