export type SceneType =
  | 'opening'
  | 'hook'
  | 'question'
  | 'countdown'
  | 'answer'
  | 'explanation'
  | 'transition'
  | 'closing'
  | 'cta';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  surface: string;
}

export interface ThemeTypography {
  heading: string;
  body: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  vibe: string;
  ambientStyle: string;
  animationStyle: string;
  transitionStyle: string;
  countdownStyle: string;
  soundStyle: string;
  voiceStyle: string;
  emotionalTone: string;
  cinematicStyle: string;
}

export interface BaseScene {
  id: string;
  type: SceneType;
  duration: number; // in milliseconds
  audio?: {
    narration?: string;
    soundEffect?: string;
  };
}

export interface TextScene extends BaseScene {
  type: 'opening' | 'hook' | 'transition' | 'closing' | 'cta';
  text: string;
  subtext?: string;
}

export interface QuestionScene extends BaseScene {
  type: 'question';
  question: string;
  options: string[];
}

export interface CountdownScene extends BaseScene {
  type: 'countdown';
  seconds: number;
  question: string;
  options: string[];
}

export interface AnswerScene extends BaseScene {
  type: 'answer';
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface ExplanationScene extends BaseScene {
  type: 'explanation';
  text: string;
}

export type Scene =
  | TextScene
  | QuestionScene
  | CountdownScene
  | AnswerScene
  | ExplanationScene;

export interface Episode {
  id: string;
  topic: string;
  theme: Theme;
  metadata?: {
    title: string;
    material: string;
    episodeName: string;
    questionCount: number;
    estimatedDuration: number;
    voice: string;
  };
  audioConfig?: {
    backgroundMusic?: string;
    transitionSound?: string;
    countdownSound?: string;
    answerCorrectSound?: string;
    answerWrongSound?: string;
    ambience?: string;
    audioVolume?: {
      backgroundMusic: number;
      narration: number;
      sfx: number;
    };
  };
  scenes: Scene[];
  status: 'draft' | 'generating' | 'ready' | 'playing';
}
