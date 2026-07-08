import { Episode, Theme } from '../types';

export const dummyTheme: Theme = {
  id: 'dark-luxury-gold',
  name: 'Dark Luxury Gold',
  vibe: 'cinematic-luxury',
  colors: {
    primary: '#D4AF37', // Gold
    secondary: '#0F172A', // Deep slate
    accent: '#10B981', // Emerald
    background: '#020617', // Very dark slate
    text: '#F8FAFC', // Slate 50
    surface: 'rgba(15, 23, 42, 0.6)', // Glassmorphism surface
  },
  typography: {
    heading: 'font-serif',
    body: 'font-sans',
  },
  ambientStyle: 'dramatic lighting',
  animationStyle: 'smooth',
  transitionStyle: 'fade',
  countdownStyle: 'minimal',
  soundStyle: 'epic',
  voiceStyle: 'deep cinematic',
  emotionalTone: 'inspiring',
  cinematicStyle: 'cinematic'
}

export const dummyEpisode: Episode = {
  id: 'ep-001',
  topic: 'Sejarah Nabi Muhammad SAW',
  theme: dummyTheme,
  status: 'ready',
  audioConfig: {
    backgroundMusic: 'epic-orchestral',
    transitionSound: 'swoosh',
    countdownSound: 'tick',
    answerCorrectSound: 'correct',
    answerWrongSound: 'wrong',
    ambience: 'cinematic-ambience'
  },
  scenes: [
    {
      id: 'sc-1',
      type: 'opening',
      duration: 4000,
      text: 'Kuis Islami',
      subtext: 'Episode 1: Sejarah Nabi Muhammad SAW'
    },
    {
      id: 'sc-2',
      type: 'hook',
      duration: 3000,
      text: 'Seberapa jauh kamu mengenal Rasulullah?',
      subtext: 'Mari kita uji wawasanmu!'
    },
    {
      id: 'sc-3',
      type: 'question',
      duration: 4000,
      question: 'Siapakah nama kakek Nabi Muhammad SAW yang merawat beliau setelah ibunya wafat?',
      options: ['Abu Thalib', 'Abdul Muthalib', 'Abbas bin Abdul Muthalib', 'Hamzah bin Abdul Muthalib']
    },
    {
      id: 'sc-4',
      type: 'countdown',
      duration: 5000,
      seconds: 5,
      question: 'Siapakah nama kakek Nabi Muhammad SAW yang merawat beliau setelah ibunya wafat?',
      options: ['Abu Thalib', 'Abdul Muthalib', 'Abbas bin Abdul Muthalib', 'Hamzah bin Abdul Muthalib']
    },
    {
      id: 'sc-5',
      type: 'answer',
      duration: 4000,
      question: 'Siapakah nama kakek Nabi Muhammad SAW yang merawat beliau setelah ibunya wafat?',
      options: ['Abu Thalib', 'Abdul Muthalib', 'Abbas bin Abdul Muthalib', 'Hamzah bin Abdul Muthalib'],
      correctAnswerIndex: 1
    },
    {
      id: 'sc-6',
      type: 'explanation',
      duration: 6000,
      text: 'Setelah Siti Aminah wafat, Nabi Muhammad SAW dirawat oleh kakeknya, Abdul Muthalib, hingga usia 8 tahun.'
    },
    {
      id: 'sc-7',
      type: 'transition',
      duration: 2000,
      text: 'Pertanyaan Selanjutnya...'
    },
    {
      id: 'sc-8',
      type: 'question',
      duration: 4000,
      question: 'Di kota manakah Nabi Muhammad SAW dilahirkan?',
      options: ['Madinah', 'Thaif', 'Makkah', 'Yaman']
    },
    {
      id: 'sc-9',
      type: 'countdown',
      duration: 5000,
      seconds: 5,
      question: 'Di kota manakah Nabi Muhammad SAW dilahirkan?',
      options: ['Madinah', 'Thaif', 'Makkah', 'Yaman']
    },
    {
      id: 'sc-10',
      type: 'answer',
      duration: 4000,
      question: 'Di kota manakah Nabi Muhammad SAW dilahirkan?',
      options: ['Madinah', 'Thaif', 'Makkah', 'Yaman'],
      correctAnswerIndex: 2
    },
    {
      id: 'sc-11',
      type: 'explanation',
      duration: 6000,
      text: 'Nabi Muhammad SAW dilahirkan di kota Makkah pada hari Senin, 12 Rabiul Awal Tahun Gajah.'
    },
    {
      id: 'sc-12',
      type: 'closing',
      duration: 4000,
      text: 'Alhamdulillah',
      subtext: 'Semoga ilmu kita semakin bertambah.'
    },
    {
      id: 'sc-13',
      type: 'cta',
      duration: 5000,
      text: 'Follow untuk kuis Islami selanjutnya!',
      subtext: 'Jangan lupa like & share'
    }
  ]
}
