'use client';

import { X, FileText, Globe, CheckCircle2, Layers, HardDrive, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeResource } from '@/store/useChatStore';

interface KnowledgeDetailsModalProps {
  resource: KnowledgeResource | null;
  onClose: () => void;
}

export default function KnowledgeDetailsModal({ resource, onClose }: KnowledgeDetailsModalProps) {
  if (!resource) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-bg-secondary border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-white">
                {resource.type === 'url' ? <Globe size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white truncate max-w-[240px]">
                  {resource.filename}
                </h3>
                <span className="text-[11px] text-text-secondary uppercase tracking-wider">
                  {resource.type} Resource
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Info Grid */}
          <div className="py-5 space-y-3.5 text-xs text-zinc-300">
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="flex items-center gap-2 text-text-secondary">
                <CheckCircle2 size={14} className="text-emerald-400" /> Status:
              </span>
              <span className="font-medium text-emerald-400 capitalize">{resource.status}</span>
            </div>

            {resource.fileSize && (
              <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                <span className="flex items-center gap-2 text-text-secondary">
                  <HardDrive size={14} /> File Size:
                </span>
                <span className="font-mono">{resource.fileSize}</span>
              </div>
            )}

            {resource.totalChunks !== undefined && (
              <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                <span className="flex items-center gap-2 text-text-secondary">
                  <Layers size={14} /> Vector Chunks:
                </span>
                <span className="font-mono">{resource.totalChunks} Chunks</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="flex items-center gap-2 text-text-secondary">
                <Calendar size={14} /> Added On:
              </span>
              <span className="font-mono">
                {new Date(resource.uploadTime).toLocaleString()}
              </span>
            </div>

            {resource.url && (
              <div className="pt-2">
                <span className="text-text-secondary block mb-1">Source URL:</span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline truncate block text-[11px]"
                >
                  {resource.url}
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
