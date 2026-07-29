'use client';

import { useChatStore, KnowledgeResource } from '@/store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';
import KnowledgeChip from '@/components/knowledge/KnowledgeChip';

interface KnowledgeBarProps {
  conversationId: string;
  onReprocessResource?: (resource: KnowledgeResource) => void;
}

export default function KnowledgeBar({ conversationId, onReprocessResource }: KnowledgeBarProps) {
  const { knowledgeByConversation } = useChatStore();
  const resources = knowledgeByConversation[conversationId] || [];

  if (resources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="w-full mb-3 px-1"
    >
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1 px-1">
        <AnimatePresence mode="popLayout">
          {resources.map((resource) => (
            <KnowledgeChip
              key={resource.id}
              resource={resource}
              conversationId={conversationId}
              onReprocess={onReprocessResource}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
