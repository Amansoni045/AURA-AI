'use client';

import { useState, useRef, useEffect } from 'react';
import { FileText, Globe, MoreVertical, X, Image as ImageIcon, Video, Music, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { KnowledgeResource, useChatStore } from '@/store/useChatStore';
import KnowledgeStatusBadge from '@/components/knowledge/KnowledgeStatusBadge';
import KnowledgeMenu from '@/components/knowledge/KnowledgeMenu';
import KnowledgeDetailsModal from '@/components/knowledge/KnowledgeDetailsModal';

interface KnowledgeChipProps {
  resource: KnowledgeResource;
  conversationId: string;
  onReprocess?: (resource: KnowledgeResource) => void;
}

export default function KnowledgeChip({ resource, conversationId, onReprocess }: KnowledgeChipProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(resource.filename);

  const { removeKnowledgeResource, renameKnowledgeResource } = useChatStore();
  const menuRef = useRef<HTMLDivElement>(null);

  // Icon selector
  const getResourceIcon = () => {
    switch (resource.type) {
      case 'url':
        return <Globe size={18} />;
      case 'docx':
        return <BookOpen size={18} />;
      case 'image':
        return <ImageIcon size={18} />;
      case 'video':
        return <Video size={18} />;
      case 'audio':
        return <Music size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      renameKnowledgeResource(conversationId, resource.id, nameInput.trim());
    }
    setIsEditing(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.92, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 5 }}
        className={clsx(
          "relative group flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all duration-200 shrink-0 shadow-md backdrop-blur-md min-w-[200px] max-w-[260px]",
          resource.status === 'ready' && "bg-emerald-950/20 border-emerald-500/25 hover:border-emerald-500/40 text-emerald-100",
          resource.status === 'failed' && "bg-red-950/30 border-red-500/40 text-red-200",
          resource.status !== 'ready' && resource.status !== 'failed' && "bg-bg-secondary/90 border-white/10 text-white"
        )}
      >
        {/* Icon */}
        <div className={clsx(
          "p-2 rounded-xl flex items-center justify-center shrink-0",
          resource.status === 'ready' && "bg-emerald-500/10 text-emerald-400",
          resource.status === 'failed' && "bg-red-500/10 text-red-400",
          resource.status !== 'ready' && resource.status !== 'failed' && "bg-white/5 text-zinc-300"
        )}>
          {getResourceIcon()}
        </div>

        {/* Name & Status */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <form onSubmit={handleRenameSubmit}>
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={() => setIsEditing(false)}
                className="w-full bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-xs outline-none text-white"
              />
            </form>
          ) : (
            <h4 className="text-xs font-semibold truncate text-white/90" title={resource.filename}>
              {resource.filename}
            </h4>
          )}

          <div className="mt-0.5">
            <KnowledgeStatusBadge
              status={resource.status}
              progress={resource.progress}
              stageText={resource.stageText}
            />
          </div>
        </div>

        {/* Menu & Remove Actions */}
        <div ref={menuRef} className="relative flex items-center gap-0.5">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            title="Options"
          >
            <MoreVertical size={14} />
          </button>

          <button
            onClick={() => removeKnowledgeResource(conversationId, resource.id)}
            className="p-1 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Remove resource"
          >
            <X size={14} />
          </button>

          <KnowledgeMenu
            isOpen={showMenu}
            onClose={() => setShowMenu(false)}
            onViewDetails={() => setShowDetails(true)}
            onRename={() => setIsEditing(true)}
            onReprocess={() => onReprocess && onReprocess(resource)}
            onRemove={() => removeKnowledgeResource(conversationId, resource.id)}
          />
        </div>
      </motion.div>

      {/* Details Modal */}
      {showDetails && (
        <KnowledgeDetailsModal
          resource={resource}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
