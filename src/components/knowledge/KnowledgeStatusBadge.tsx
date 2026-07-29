'use client';

import { Loader2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { KnowledgeResource } from '@/store/useChatStore';

interface KnowledgeStatusBadgeProps {
  status: KnowledgeResource['status'];
  progress?: number;
  stageText?: string;
}

export default function KnowledgeStatusBadge({ status, progress = 0, stageText }: KnowledgeStatusBadgeProps) {
  if (status === 'ready') {
    return (
      <div className="flex items-center gap-1.2 text-emerald-400 font-medium text-[11px]">
        <CheckCircle2 size={13} />
        <span>✓ Ready</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center gap-1.2 text-red-400 font-medium text-[11px]">
        <AlertTriangle size={13} />
        <span>⚠ Failed</span>
      </div>
    );
  }

  if (status === 'queued') {
    return (
      <div className="flex items-center gap-1.2 text-zinc-400 text-[11px]">
        <Clock size={13} />
        <span>Queued</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
      <Loader2 size={13} className="animate-spin text-white" />
      <span className="truncate">{stageText || `${status}...`}</span>
      {status === 'uploading' && progress > 0 && (
        <span className="font-mono text-[10px] text-white/50">{progress}%</span>
      )}
    </div>
  );
}
