
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, Image as ImageIcon, Sparkles, Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 mb-8">
      <div className="relative flex flex-col bg-[#1e1f20] border border-transparent focus-within:border-[#3c3d3e] rounded-[28px] overflow-hidden transition-all shadow-xl p-2 px-4">
        <div className="flex items-end gap-2">
          <button className="p-3 text-gray-400 hover:text-white hover:bg-[#333] rounded-full transition-colors mb-0.5">
            <Plus size={24} />
          </button>
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gemini 3"
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-3 resize-none max-h-[200px] text-lg outline-none"
          />

          <div className="flex items-center gap-1 mb-0.5">
             <button className="p-3 text-gray-400 hover:text-white hover:bg-[#333] rounded-full transition-colors hidden sm:block">
              <Sparkles size={24} />
            </button>
            <button className="p-3 text-gray-400 hover:text-white hover:bg-[#333] rounded-full transition-colors">
              <Mic size={24} />
            </button>
            {input.trim() && (
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-3 text-[#79a9ff] hover:bg-[#333] rounded-full transition-colors disabled:opacity-50"
              >
                <Send size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
