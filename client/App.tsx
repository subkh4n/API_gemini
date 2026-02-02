
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import { Message } from './types';
import { sendMessage, generateImage } from './services/geminiService';
import { 
  Image as ImageIcon, 
  Video, 
  PenTool, 
  Lightbulb, 
  TrendingUp, 
  UserCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Detect intent for image generation
    const isImageRequest = /create an image|generate a picture|draw|make an image/i.test(text);

    if (isImageRequest) {
      const imageUrl = await generateImage(text);
      if (imageUrl) {
        const modelMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `Here is the image I generated for: "${text}"`,
          type: 'image',
          mediaUrl: imageUrl,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, modelMsg]);
      } else {
        const modelMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "I tried to generate an image but something went wrong.",
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, modelMsg]);
      }
    } else {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessage(text, history);
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-[#e3e3e3] overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNewChat={handleNewChat}
      />

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between p-4 px-6 h-16 shrink-0">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
               <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-[#333] rounded-full text-gray-400 transition-colors lg:hidden"
              >
                <div className="w-6 h-6 flex flex-col justify-center gap-1">
                  <span className="block h-0.5 w-6 bg-current"></span>
                  <span className="block h-0.5 w-6 bg-current"></span>
                  <span className="block h-0.5 w-6 bg-current"></span>
                </div>
              </button>
            )}
            <h1 className="text-xl font-medium tracking-tight text-white select-none">Gemini</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded-md text-xs font-semibold text-gray-300">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              PRO
            </button>
            <UserCircle size={32} className="text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" />
          </div>
        </header>

        {/* Chat Content Area */}
        <div className="flex-1 overflow-y-auto pb-32">
          {messages.length === 0 ? (
            <WelcomeScreen onQuickAction={handleSendMessage} />
          ) : (
            <div className="max-w-3xl mx-auto py-8 space-y-12">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 px-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">AI</span>
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-[#333] px-6 py-4 rounded-[24px]' : 'w-full'}`}>
                    <div className="prose prose-invert max-w-none text-[17px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    {msg.type === 'image' && msg.mediaUrl && (
                      <div className="mt-4 rounded-xl overflow-hidden shadow-lg border border-[#333]">
                        <img src={msg.mediaUrl} alt="Generated AI Content" className="w-full max-h-[500px] object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 px-4">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0 animate-pulse">
                      <span className="text-[10px] font-bold">AI</span>
                    </div>
                    <div className="space-y-2 pt-4">
                      <div className="h-4 w-64 bg-[#333] rounded-full animate-pulse"></div>
                      <div className="h-4 w-48 bg-[#333] rounded-full animate-pulse delay-75"></div>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e] to-transparent pt-12 pb-4">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          <p className="text-center text-[10px] text-gray-500 px-4">
            Gemini may display inaccurate info, including about people, so double-check its responses. 
            <a href="#" className="underline ml-1">Your privacy & Gemini Apps</a>
          </p>
        </div>
      </main>
    </div>
  );
};

const WelcomeScreen: React.FC<{ onQuickAction: (text: string) => void }> = ({ onQuickAction }) => {
  return (
    <div className="max-w-3xl mx-auto w-full px-6 flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-[52px] font-semibold tracking-tight text-white mb-2 leading-tight">
        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 bg-clip-text text-transparent">Hello, MOH</span>
      </h2>
      <h3 className="text-4xl text-gray-500 font-medium mb-12">Where should we start?</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        <ActionCard 
          icon={<ImageIcon className="text-yellow-500" size={20} />} 
          label="Create image" 
          onClick={() => onQuickAction("Generate a futuristic city in neon style")}
        />
        <ActionCard 
          icon={<Video className="text-blue-500" size={20} />} 
          label="Create a video" 
          onClick={() => onQuickAction("Generate a short video script for a tech review")}
        />
        <ActionCard 
          icon={<PenTool className="text-green-500" size={20} />} 
          label="Write anything" 
          onClick={() => onQuickAction("Write a professional email for a project proposal")}
        />
        <ActionCard 
          icon={<Lightbulb className="text-red-500" size={20} />} 
          label="Help me learn" 
          onClick={() => onQuickAction("Explain quantum computing in simple terms")}
        />
        <ActionCard 
          icon={<TrendingUp className="text-purple-500" size={20} />} 
          label="Boost my day" 
          onClick={() => onQuickAction("Give me some positive productivity tips for today")}
        />
      </div>
    </div>
  );
};

const ActionCard: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-[#1e1f20] hover:bg-[#333] border border-[#333] rounded-2xl transition-all group"
    >
      <div className="p-2 rounded-full group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-300">{label}</span>
    </button>
  );
};

export default App;
