'use client';

import { useChatStore } from '@/store/useChatStore';
import { ChevronDown, Settings, Share2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const MODELS = [
  { id: 'mistral-large-latest', name: 'Aura Intellect (Mistral)', icon: <Sparkles size={14} className="text-pink-400" /> },
  { id: 'gemini-2.0-flash', name: 'Aura Flash', icon: <Sparkles size={14} className="text-blue-400" /> },
  { id: 'llama-3.3-70b-versatile', name: 'Aura Turbo (Llama)', icon: <Sparkles size={14} className="text-orange-400" /> },
  { id: 'gemini-1.5-pro', name: 'Aura Pro', icon: <Sparkles size={14} className="text-purple-400" /> },
];



export default function TopBar() {
  const { model, setModel, sidebarCollapsed } = useChatStore();

  const currentModel = MODELS.find(m => m.id === model) || MODELS[0];

  return (
    <header className={clsx(
      "h-14 border-b border-border-main flex items-center justify-between px-4 bg-bg-primary/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-300",
      sidebarCollapsed ? "pl-14" : "pl-4"
    )}>
      <div className="flex items-center gap-2">
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
            {currentModel.icon}
            <span className="text-sm font-medium">{currentModel.name}</span>
            <ChevronDown size={14} className="text-text-secondary" />
          </button>
          
          <div className="absolute top-full left-0 mt-1 w-48 bg-bg-surface border border-border-main rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 overflow-hidden">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                {m.icon}
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-white/[0.05] text-text-secondary hover:text-white transition-colors">
          <Share2 size={18} />
        </button>
        <button className="p-2 rounded-lg hover:bg-white/[0.05] text-text-secondary hover:text-white transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
