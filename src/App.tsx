import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Send, 
  User, 
  Bot, 
  Camera, 
  Wind, 
  Award, 
  Briefcase, 
  GraduationCap,
  Languages,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { NiniService } from './services/niniService';
import { inesData } from './data';

const niniService = new NiniService();

export default function App() {
  const [messages, setMessages] = useState<{ role: 'user' | 'nini'; text: string }[]>([
    { 
      role: 'nini', 
      text: "Hi I'm Nini, the personnal assistance of Inès, let me demonstrate why Inès is the perfect employee for you / Hello, je suis Nini, l'assistant personnel de Inès, dites moi comment je peux vous démontrer qu'Inès est la collaboratrice qu'il vous faut." 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);

  useEffect(() => {
    chatRef.current = niniService.createChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'nini', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'nini', text: "Error connecting to Nini. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLive = async () => {
    if (isLive) {
      if (liveSessionRef.current) {
        const session = await liveSessionRef.current;
        session.close();
      }
      setIsLive(false);
      return;
    }

    try {
      setIsLive(true);
      // Setup audio context for playback
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      const sessionPromise = niniService.startLiveSession({
        onAudioChunk: (base64) => {
          if (isMuted) return;
          const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
          audioContextRef.current?.decodeAudioData(arrayBuffer, (buffer) => {
            const source = audioContextRef.current!.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current!.destination);
            source.start();
          });
        },
        onTextUpdate: (text) => {
          // Live API text updates if needed
        },
        onInterrupted: () => {
          // Handle interruption logic
        },
        onError: (err) => {
          console.error("Live Error:", err);
          setIsLive(false);
        }
      });

      liveSessionRef.current = sessionPromise;

      // Microphone capture
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (!isLive) return;
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        
        sessionPromise.then(session => {
          session.sendRealtimeInput({
            media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        });
      };

    } catch (error) {
      console.error("Failed to start live session:", error);
      setIsLive(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar - Profile Summary */}
      <aside className="w-full lg:w-96 bg-white border-r border-black/5 p-8 overflow-y-auto hidden lg:block">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#f5f2ed] shadow-lg">
            <img 
              src="https://picsum.photos/seed/ines/400/400" 
              alt="Inès Kwiatkowski" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">{inesData.name}</h1>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-medium">{inesData.title}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <Award className="w-4 h-4 mr-2" /> Highlights
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-[#f5f2ed] p-2 rounded-lg mr-3">
                  <Briefcase className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold">HP France</p>
                  <p className="text-xs text-gray-500">+3 pts Market Share</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#f5f2ed] p-2 rounded-lg mr-3">
                  <GraduationCap className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Valedictorian</p>
                  <p className="text-xs text-gray-500">ESCE Master's Degree</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <Wind className="w-4 h-4 mr-2" /> Passion & Drive
            </h2>
            <div className="flex flex-wrap gap-2">
              {inesData.interests.map((interest, i) => (
                <span key={i} className="px-3 py-1 bg-[#f5f2ed] rounded-full text-xs font-medium">
                  {interest}
                </span>
              ))}
              {inesData.personality.map((trait, i) => (
                <span key={i} className="px-3 py-1 border border-black/5 rounded-full text-xs font-medium">
                  {trait}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <Languages className="w-4 h-4 mr-2" /> Languages
            </h2>
            <div className="space-y-2">
              {inesData.skills.languages.map((lang, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{lang.language}</span>
                  <span className="text-xs text-gray-500">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-[#f5f2ed] relative">
        {/* Header */}
        <header className="h-16 glass-panel flex items-center justify-between px-6 z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Nini</h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Career Agent</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-red-50 text-red-500' : 'hover:bg-black/5'}`}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleLive}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isLive 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                : 'bg-black text-white hover:bg-black/80'
              }`}
            >
              {isLive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isLive ? 'Stop Voice' : 'Talk to Nini'}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-white border border-black/5' : 'bg-black text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-black text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-t from-[#f5f2ed] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Nini about Inès..."
              className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 pr-14 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black text-white rounded-xl hover:bg-black/80 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
            Powered by Gemini 3.1 & Nini Career Intelligence
          </p>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full flex items-center gap-3 z-20"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 16, 8] }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                  className="w-1 bg-red-500 rounded-full"
                />
              ))}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">Live Voice Session</span>
          </motion.div>
        )}
      </main>
    </div>
  );
}
