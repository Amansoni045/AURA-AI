'use client';

import { Message } from '@/store/useChatStore';
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface MessageItemProps {
  message: Message;
  isLast?: boolean;
  isStreaming?: boolean;
}

export default function MessageItem({ message, isLast, isStreaming }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "group py-8 w-full",
        isAssistant ? "bg-transparent" : "bg-transparent"
      )}
    >
      <div className="max-w-[800px] mx-auto px-4 flex gap-6">
        <div className="shrink-0 pt-1">
          {isAssistant ? (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-aura-purple to-aura-cyan flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">AURA</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
              AS
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {isAssistant ? 'AURA-AI' : 'You'}
            </span>
          </div>

          <div className={clsx(
            "prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-white/10 prose-code:text-aura-cyan max-w-none",
            message.content.includes('🚫') || message.content.startsWith('Error:') ? "text-red-400 bg-red-400/5 p-4 rounded-xl border border-red-400/20" : ""
          )}>
            {isStreaming && !message.content ? (
              <div className="flex gap-1.5 py-2">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          {isAssistant && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-2">
              <button
                onClick={handleCopy}
                className="p-2 rounded-md hover:bg-white/[0.05] text-text-secondary hover:text-white transition-colors"
                title="Copy message"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              <button className="p-2 rounded-md hover:bg-white/[0.05] text-text-secondary hover:text-white transition-colors">
                <RotateCcw size={14} />
              </button>
              <div className="w-px h-3 bg-border-main mx-1" />
              <button className="p-2 rounded-md hover:bg-white/[0.05] text-text-secondary hover:text-white transition-colors">
                <ThumbsUp size={14} />
              </button>
              <button className="p-2 rounded-md hover:bg-white/[0.05] text-text-secondary hover:text-white transition-colors">
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
