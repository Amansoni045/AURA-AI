import { useChatStore } from '@/store/useChatStore';
import { ChevronDown, Settings, Share2, Sparkles, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useState } from 'react';
import SettingsModal from './SettingsModal';

const MODELS = [
  { id: 'mistral-large-latest', name: 'Aura Intellect (Mistral)', icon: <Sparkles size={14} className="text-pink-400" /> },
  { id: 'gemini-2.0-flash', name: 'Aura Flash', icon: <Sparkles size={14} className="text-blue-400" /> },
  { id: 'llama-3.3-70b-versatile', name: 'Aura Turbo (Llama)', icon: <Sparkles size={14} className="text-orange-400" /> },
  { id: 'gemini-1.5-pro', name: 'Aura Pro', icon: <Sparkles size={14} className="text-purple-400" /> },
];

export default function TopBar() {
  const { model, setModel, sidebarCollapsed } = useChatStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const currentModel = MODELS.find(m => m.id === model) || MODELS[0];

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Aura AI Chat',
          text: 'Check out my conversation with Aura AI!',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <>
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
          <div className="relative">
            <button 
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-text-secondary hover:text-white transition-colors relative"
            >
              <Share2 size={18} />
            </button>
            <AnimatePresence>
              {showShareToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-aura-purple text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap z-50 flex items-center gap-2"
                >
                  <Check size={12} /> LINK COPIED
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-white/[0.05] text-text-secondary hover:text-white transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
