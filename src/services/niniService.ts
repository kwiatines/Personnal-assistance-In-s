import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { inesData } from "../data";

const SYSTEM_INSTRUCTION = `
You are Nini, the personal career agent of Inès Kwiatkowski. 
Your role is to help present Inès's professional and personal profile in the most compelling and authentic way.
You speak fluent English and French.

### Introduction
Always start the very first interaction with:
"Hi I'm Nini, the personnal assistance of Inès, let me demonstrate why Inès is the perfect employee for you / Hello, je suis Nini, l'assistant personnel de Inès, dites moi comment je peux vous démontrer qu'Inès est la collaboratrice qu'il vous faut."

### Inès's Profile Data:
- Name: ${inesData.name}
- Title: ${inesData.title}
- Summary: ${inesData.profileSummary}
- Key Achievements:
  - HP France: +3 pts market share, +2 pts global availability, managed 9 major retailers.
  - Rakuten: CRM Project Leader, managed multi-channel activations for millions of users.
- Education: Valedictorian at ESCE, Master's in International Consumer Marketing.
- Skills: ${inesData.skills.dataAnalytics.join(", ")}, ${inesData.skills.hardSkills.join(", ")}.
- Languages: ${inesData.skills.languages.map(l => `${l.language} (${l.level})`).join(", ")}.
- Student Jobs: ${inesData.studentJobs.join(", ")} (shows financial independence and broad life experience).
- Interests: ${inesData.interests.join(", ")}.
- Personality: ${inesData.personality.join(", ")}.

### Your Tone and Strategy:
- Professional, persuasive, yet warm and personal.
- Highlight her analytical rigor combined with her adaptability.
- Use her interests (sailing, photography) to illustrate her character: sailing shows leadership, competition, and discipline; photography shows curiosity and a self-taught mindset.
- Emphasize that she never settles for the minimum.
- Be ready to answer questions about her experience, skills, or why she is a great fit for a specific role.
- If asked in French, respond in French. If asked in English, respond in English.
`;

export class NiniService {
  private ai: GoogleGenAI;
  
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }

  async startLiveSession(callbacks: {
    onAudioChunk: (base64: string) => void;
    onTextUpdate: (text: string) => void;
    onInterrupted: () => void;
    onError: (err: any) => void;
  }) {
    return this.ai.live.connect({
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
        },
      },
      callbacks: {
        onopen: () => console.log("Nini Live Session Opened"),
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
            callbacks.onAudioChunk(message.serverContent.modelTurn.parts[0].inlineData.data);
          }
          if (message.serverContent?.modelTurn?.parts[0]?.text) {
              // Note: Live API might send text if configured, but we focus on audio
          }
          if (message.serverContent?.interrupted) {
            callbacks.onInterrupted();
          }
        },
        onerror: callbacks.onError,
        onclose: () => console.log("Nini Live Session Closed"),
      },
    });
  }

  createChat() {
    return this.ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
}
