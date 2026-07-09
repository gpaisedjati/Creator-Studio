import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System Instruction for Gemini
const systemInstruction = `You are an Islamic AI Creative Director, Islamic Content Strategist, Quiz Writer, Story Director, and Experience Designer.
Your task is to generate high-quality, engaging quiz episodes on Islamic topics.
You must return your output ONLY as a structured JSON object according to the provided schema.
Do NOT generate HTML, JSX, CSS, or UI components. Only generate the data.

Guidelines:
1. Accuracy: Ensure all Islamic content, historical facts, Quranic verses, and Hadiths are accurate and sourced reliably. Do not invent or hallucinate quotes or historical facts.
2. Structure: Follow the required scene flow: Opening -> Hook -> 5 to 10 Multiple Choice Questions (each with answer and explanation) -> Closing.
3. Tone: Cinematic, inspiring, educational, and respectful.
4. Language: Indonesian.
5. Questions: Make the options challenging but fair. CRITICAL: The correct answer MUST be randomly placed among the 4 options. The correctAnswerIndex must vary randomly between 0, 1, 2, and 3 for each question. DO NOT always make it 0.

Theme generation (Dynamic Theme Engine):
You must decide the entire visual and emotional experience of the episode.
Select one of these base themes or create a new one that perfectly fits the topic:
- "Dark Luxury Gold" (Gold/Black, cinematic)
- "Emerald Islamic" (Emerald/Green, clean)
- "Ka'bah Night" (Black/Gold/White, calm)
- "Ramadan Lantern" (Warm Orange/Gold, soft)
- "Islamic Geometry" (Blue/Gold, structured)
- "Desert Epic" (Sand/Orange/Brown, dramatic)
- "Blue Mosque" (Blue/White, serene)
- "Ottoman Royal" (Red/Gold, majestic)

You must fill in all theme properties (primaryColor, accentColor, backgroundStyle, ambientStyle, typography, animationStyle, transitionStyle, countdownStyle, soundStyle, voiceStyle, emotionalTone, cinematicStyle) to match the chosen vibe.

Audio Experience Engine:
You must determine the audio layout of the episode.
Provide placeholder URLs (like https://placeholder.com/audio/epic-bgm.mp3) or descriptive identifiers (like "epic-orchestral", "soft-nasheed", "warm-chime") for the following fields in audioConfig:
- backgroundMusic (e.g. "https://audio.com/ramadan-ambience.mp3" or "epic-orchestral")
- transitionSound (e.g. "https://audio.com/swoosh.mp3" or "dramatic-swoosh")
- countdownSound (e.g. "https://audio.com/tick.mp3" or "elegant-chime")
- answerCorrectSound
- answerWrongSound
- ambience
`;

// AI Episode Schema
const aiEpisodeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    episodeTitle: { type: Type.STRING },
    topic: { type: Type.STRING },
    theme: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "e.g., Dark Luxury Gold, Emerald Islamic" },
        primaryColor: { type: Type.STRING, description: "e.g., #D4AF37" },
        accentColor: { type: Type.STRING, description: "e.g., #10B981" },
        backgroundStyle: { type: Type.STRING, description: "e.g., Cinematic / Elegant" },
        ambientStyle: { type: Type.STRING, description: "e.g., dramatic lighting, soft glow, particles" },
        typography: { type: Type.STRING, description: "e.g., serif, sans-serif" },
        animationStyle: { type: Type.STRING, description: "e.g., smooth, bouncy, minimal" },
        transitionStyle: { type: Type.STRING, description: "e.g., fade, slide, cinematic zoom" },
        countdownStyle: { type: Type.STRING, description: "e.g., minimal ring, glowing pulse" },
        soundStyle: { type: Type.STRING, description: "e.g., epic orchestral, serene nasheed" },
        voiceStyle: { type: Type.STRING, description: "e.g., deep cinematic, soft assuring" },
        emotionalTone: { type: Type.STRING, description: "e.g., dramatic, calm, inspiring" },
        cinematicStyle: { type: Type.STRING, description: "e.g., cinematic, documentary, fast-paced" }
      },
      required: ["name", "primaryColor", "accentColor", "backgroundStyle", "ambientStyle", "typography", "animationStyle", "transitionStyle", "countdownStyle", "soundStyle", "voiceStyle", "emotionalTone", "cinematicStyle"]
    },
    opening: {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING, description: "Main opening text/title" },
        subtext: { type: Type.STRING, description: "Subtitle or contextual opening" }
      },
      required: ["text"]
    },
    hook: {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING, description: "Engaging hook to draw the audience in" },
        subtext: { type: Type.STRING }
      },
      required: ["text"]
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctAnswerIndex: { type: Type.INTEGER, description: "0-based index of the correct option" },
          explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"]
      }
    },
    closing: {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING, description: "Concluding thought or call to action" },
        subtext: { type: Type.STRING }
      },
      required: ["text"]
    },
    audioConfig: {
      type: Type.OBJECT,
      description: "Audio configuration for the entire episode",
      properties: {
        backgroundMusic: { type: Type.STRING, description: "URL or identifier for background music" },
        transitionSound: { type: Type.STRING, description: "URL or identifier for transition sound" },
        countdownSound: { type: Type.STRING, description: "URL or identifier for countdown sound" },
        answerCorrectSound: { type: Type.STRING, description: "URL or identifier for correct answer sound" },
        answerWrongSound: { type: Type.STRING, description: "URL or identifier for wrong answer sound" },
        ambience: { type: Type.STRING, description: "URL or identifier for ambient sound" }
      },
      required: ["backgroundMusic", "transitionSound", "countdownSound", "answerCorrectSound", "answerWrongSound", "ambience"]
    }
  },
  required: ["episodeTitle", "topic", "theme", "opening", "hook", "questions", "closing", "audioConfig"]
};

app.post("/api/generate", async (req, res) => {
  try {
    const { material, episodeName, questionCount } = req.body;
    
    if (!material) {
      return res.status(400).json({ error: "Material is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing from environment variables." });
    }

    const requestedQuestionCount = questionCount || 5;

    const prompt = `Generate a highly engaging, interactive Islamic quiz episode.
Material Topic: "${material}"
Specific Episode: "${episodeName || 'General / Intro'}"
Number of Questions: ${requestedQuestionCount}

Ensure the content matches the specific episode requested, but within the broader material topic context. Make sure to generate EXACTLY ${requestedQuestionCount} questions. Make it suitable for a general audience.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: aiEpisodeSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    let aiData;
    try {
      aiData = JSON.parse(text);
    } catch (e) {
      throw new Error("Failed to parse AI JSON response");
    }

    const calculateDuration = (text: string) => {
      const words = (text || "").split(' ').length;
      return Math.max(3000, 1000 + (words * 350)); // Minimum 3s, 350ms per word + 1s buffer
    };

    let totalDurationMs = 0;

    // Map AI output to Frontend Episode Schema
    const scenes: any[] = [];
    
    const openingDuration = calculateDuration(aiData.opening.text + " " + (aiData.opening.subtext || ""));
    totalDurationMs += openingDuration;
    scenes.push({
      id: `scene-opening`,
      type: 'opening',
      duration: openingDuration,
      text: aiData.opening.text,
      subtext: aiData.opening.subtext,
      audio: { narration: `https://placeholder.com/audio/opening.mp3` }
    });

    const hookDuration = calculateDuration(aiData.hook.text + " " + (aiData.hook.subtext || ""));
    totalDurationMs += hookDuration;
    scenes.push({
      id: `scene-hook`,
      type: 'hook',
      duration: hookDuration,
      text: aiData.hook.text,
      subtext: aiData.hook.subtext,
      audio: { narration: `https://placeholder.com/audio/hook.mp3` }
    });

    aiData.questions.forEach((q: any, i: number) => {
      const qDuration = calculateDuration(q.question + " " + q.options.join(' '));
      totalDurationMs += qDuration;
      scenes.push({
        id: `q${i}-question`,
        type: 'question',
        duration: qDuration,
        question: q.question,
        options: q.options,
        audio: { narration: `https://placeholder.com/audio/q${i}-question.mp3` }
      });
      
      const countdownDuration = 5000;
      totalDurationMs += countdownDuration;
      scenes.push({
        id: `q${i}-countdown`,
        type: 'countdown',
        duration: countdownDuration,
        seconds: 5,
        question: q.question,
        options: q.options,
        audio: { soundEffect: aiData.audioConfig.countdownSound }
      });

      const aDuration = calculateDuration(q.question + " " + q.options[q.correctAnswerIndex]);
      totalDurationMs += aDuration;
      scenes.push({
        id: `q${i}-answer`,
        type: 'answer',
        duration: aDuration,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        audio: { narration: `https://placeholder.com/audio/q${i}-answer.mp3` }
      });

      const expDuration = calculateDuration(q.explanation);
      totalDurationMs += expDuration;
      scenes.push({
        id: `q${i}-explanation`,
        type: 'explanation',
        duration: expDuration,
        text: q.explanation,
        audio: { narration: `https://placeholder.com/audio/q${i}-explanation.mp3` }
      });
    });

    const closingDuration = calculateDuration(aiData.closing.text + " " + (aiData.closing.subtext || ""));
    totalDurationMs += closingDuration;
    scenes.push({
      id: `scene-closing`,
      type: 'closing',
      duration: closingDuration,
      text: aiData.closing.text,
      subtext: aiData.closing.subtext,
      audio: { narration: `https://placeholder.com/audio/closing.mp3` }
    });

    const episode = {
      id: `ep-${Date.now()}`,
      topic: aiData.topic,
      episodeTitle: aiData.episodeTitle,
      theme: {
        id: aiData.theme.name.toLowerCase().replace(/\s+/g, '-'),
        name: aiData.theme.name,
        colors: {
          primary: aiData.theme.primaryColor,
          secondary: '#000000',
          accent: aiData.theme.accentColor,
          background: '#0a0a0a',
          text: '#ffffff',
          surface: '#111111'
        },
        typography: {
          heading: aiData.theme.typography,
          body: 'sans-serif'
        },
        vibe: aiData.theme.backgroundStyle,
        ambientStyle: aiData.theme.ambientStyle,
        animationStyle: aiData.theme.animationStyle,
        transitionStyle: aiData.theme.transitionStyle,
        countdownStyle: aiData.theme.countdownStyle,
        soundStyle: aiData.theme.soundStyle,
        voiceStyle: aiData.theme.voiceStyle,
        emotionalTone: aiData.theme.emotionalTone,
        cinematicStyle: aiData.theme.cinematicStyle
      },
      metadata: {
        title: aiData.episodeTitle || episodeName || material,
        material: material,
        episodeName: episodeName || 'General',
        questionCount: aiData.questions.length,
        estimatedDuration: totalDurationMs,
        voice: aiData.theme.voiceStyle
      },
      audioConfig: {
        backgroundMusic: aiData.audioConfig.backgroundMusic,
        transitionSound: aiData.audioConfig.transitionSound,
        countdownSound: aiData.audioConfig.countdownSound,
        answerCorrectSound: aiData.audioConfig.answerCorrectSound,
        answerWrongSound: aiData.audioConfig.answerWrongSound,
        ambience: aiData.audioConfig.ambience,
        audioVolume: {
          backgroundMusic: 0.3,
          narration: 1.0,
          sfx: 0.8
        }
      },
      scenes,
      status: 'ready'
    };

    res.json(episode);

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    let errorMessage = "Gagal menghasilkan episode. Silakan coba lagi.";
    if (error.message && error.message.includes('429')) {
      errorMessage = "Batas penggunaan API AI tercapai (Rate Limit). Silakan tunggu sekitar 1-2 menit sebelum mencoba lagi.";
    } else if (error.message) {
      // Avoid showing raw JSON errors
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.error.message) {
           if (parsed.error.message.includes('quota') || parsed.error.code === 429) {
             errorMessage = "Batas penggunaan API AI tercapai (Rate Limit). Silakan tunggu sekitar 1-2 menit sebelum mencoba lagi.";
           } else {
             errorMessage = parsed.error.message;
           }
        }
      } catch (e) {
        errorMessage = error.message;
      }
    }
    res.status(500).json({ error: errorMessage });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
