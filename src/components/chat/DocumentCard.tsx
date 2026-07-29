'use client';

import { FileText, Globe, Loader2, CheckCircle2, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { DocumentItem, useChatStore } from '@/store/useChatStore';

interface DocumentCardProps {
  document: DocumentItem;
  onRetry?: (doc: DocumentItem) => void;
}

export default function DocumentCard({ document, onRetry }: DocumentCardProps) {
  const { removeDocumentItem } = useChatStore();

  const isPdf = document.filename.toLowerCase().endsWith('.pdf');
  const isWeb = document.filename.startsWith('http://') || document.filename.startsWith('https://');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={clsx(
        "relative flex flex-col p-3 rounded-2xl border transition-all duration-200 w-64 shadow-lg backdrop-blur-md",
        document.status === 'ready' && "bg-emerald-950/20 border-emerald-500/30 text-emerald-100",
        document.status === 'failed' && "bg-red-950/30 border-red-500/40 text-red-200",
        document.status !== 'ready' && document.status !== 'failed' && "bg-bg-secondary/90 border-white/10 text-white"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Document Icon */}
        <div className={clsx(
          "p-2.5 rounded-xl flex items-center justify-center shrink-0",
          document.status === 'ready' && "bg-emerald-500/10 text-emerald-400",
          document.status === 'failed' && "bg-red-500/10 text-red-400",
          document.status !== 'ready' && document.status !== 'failed' && "bg-white/5 text-zinc-300"
        )}>
          {isWeb ? <Globe size={20} /> : <FileText size={20} />}
        </div>

        {/* Filename & Details */}
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="text-xs font-semibold truncate text-white/90" title={document.filename}>
            {document.filename}
          </h4>
          <p className="text-[10px] text-white/50 mt-0.5">
            {document.fileSize || (isWeb ? 'Web Source' : 'Document')}
          </p>
        </div>

        {/* Close / Remove button */}
        <button
          onClick={() => removeDocumentItem(document.id)}
          className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          title="Remove document"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress & Lifecycle Stage Indicator */}
      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
        {document.status === 'uploading' && (
          <div className="flex items-center gap-2 text-zinc-300 w-full">
            <Loader2 size={13} className="animate-spin text-white" />
            <span className="truncate flex-1">{document.stageText || 'Uploading...'}</span>
            <span className="font-mono text-[10px] text-white/60">{document.progress}%</span>
          </div>
        )}

        {document.status === 'processing' && (
          <div className="flex items-center gap-2 text-amber-300 w-full">
            <Loader2 size={13} className="animate-spin text-amber-400" />
            <span className="truncate flex-1">Processing document...</span>
          </div>
        )}

        {document.status === 'generating_embeddings' && (
          <div className="flex items-center gap-2 text-indigo-300 w-full">
            <Loader2 size={13} className="animate-spin text-indigo-400" />
            <span className="truncate flex-1">Generating embeddings...</span>
          </div>
        )}

        {document.status === 'ready' && (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium w-full">
            <CheckCircle2 size={14} />
            <span className="truncate">✓ Ready</span>
          </div>
        )}

        {document.status === 'failed' && (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-1.5 text-red-400 font-medium">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="truncate">{document.error || 'Upload failed'}</span>
            </div>
            {onRetry && (
              <button
                onClick={() => onRetry(document)}
                className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 py-1 rounded-lg transition-all"
              >
                <RefreshCw size={11} />
                Retry Upload
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar Line */}
      {(document.status === 'uploading' || document.status === 'processing' || document.status === 'generating_embeddings') && (
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-2">
          <motion.div
            className="bg-white h-full"
            initial={{ width: 0 }}
            animate={{ width: `${document.progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </motion.div>
  );
}
