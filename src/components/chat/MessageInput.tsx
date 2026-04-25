'use client';

import { ArrowUp, Plus, Mic, StopCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface MessageInputProps {
  onSend: (content: string) => void;
  onStop?: () => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, onStop, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
    }
  };

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  return (
    <div className="max-w-[800px] mx-auto w-full">
      <div className="relative flex items-center gap-4 bg-bg-surface border border-white/[0.08] rounded-[28px] px-6 py-2 focus-within:border-white/20 transition-all shadow-2xl group">
        <button className="p-1 rounded-full text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors">
          <Plus size={22} />
        </button>
        
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          className="flex-1 bg-transparent border-none outline-none text-[16px] py-3 resize-none max-h-[200px] custom-scrollbar placeholder:text-text-secondary/50"
        />

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors">
            <Mic size={20} />
          </button>
          
          <button
            onClick={disabled ? onStop : handleSend}
            disabled={!content.trim() && !disabled}
            className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              content.trim() || disabled
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-white/[0.05] text-white/20"
            )}
          >
            {disabled ? (
              <StopCircle size={20} className="text-black" />
            ) : (
              <div className="flex items-center justify-center">
                {content.trim() ? <ArrowUp size={20} /> : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 3v18M8 8v8M16 8v8M4 10v4M20 10v4" />
                  </svg>
                )}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
