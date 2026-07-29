'use client';

import { Info, Edit2, RefreshCw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KnowledgeMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onRename: () => void;
  onReprocess: () => void;
  onRemove: () => void;
}

export default function KnowledgeMenu({
  isOpen,
  onClose,
  onViewDetails,
  onRename,
  onReprocess,
  onRemove,
}: KnowledgeMenuProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        className="absolute bottom-10 right-0 w-48 bg-bg-secondary border border-white/10 rounded-xl p-1.5 shadow-2xl z-50 flex flex-col gap-0.5"
      >
        <button
          onClick={() => { onViewDetails(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left"
        >
          <Info size={14} />
          <span>View Details</span>
        </button>

        <button
          onClick={() => { onRename(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left"
        >
          <Edit2 size={14} />
          <span>Rename</span>
        </button>

        <button
          onClick={() => { onReprocess(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left"
        >
          <RefreshCw size={14} />
          <span>Refresh Embeddings</span>
        </button>

        <div className="my-1 border-t border-white/5" />

        <button
          onClick={() => { onRemove(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
        >
          <Trash2 size={14} />
          <span>Remove</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
