'use client';

import { useChatStore } from '@/store/useChatStore';
import { Plus, MessageSquare, Trash2, Edit2, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export default function Sidebar() {
  const { conversations, activeId, createChat, deleteChat, setActiveChat, renameChat, sidebarCollapsed, setSidebarCollapsed } = useChatStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      renameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={clsx(
          "fixed top-4 z-[60] p-2 rounded-lg hover:bg-white/[0.05] transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "left-4" : "left-[212px]"
        )}
      >
        {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 0 : 260 }}
        className={clsx(
          "relative h-screen bg-bg-secondary border-r border-border-main flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
          sidebarCollapsed ? "border-none" : ""
        )}
      >

      <div className="flex-1 flex flex-col p-4 pt-16 overflow-hidden">
        <button
          onClick={createChat}
          className="flex items-center gap-3 w-full p-3 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] transition-all group mb-6"
        >
          <div className="p-1 rounded-md bg-white/[0.1] group-hover:bg-white/[0.2] transition-colors">
            <Plus size={18} />
          </div>
          <span className="text-sm font-medium">New Chat</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {conversations.map((chat) => (
              <motion.div
                key={chat.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={clsx(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                  activeId === chat.id ? "bg-white/[0.08] text-white" : "text-text-secondary hover:bg-white/[0.04] hover:text-white"
                )}
                onClick={() => setActiveChat(chat.id)}
              >
                <MessageSquare size={16} className="shrink-0" />
                
                {editingId === chat.id ? (
                  <form onSubmit={(e) => handleRename(chat.id, e)} className="flex-1">
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => setEditingId(null)}
                      className="w-full bg-transparent border-none outline-none text-sm p-0"
                    />
                  </form>
                ) : (
                  <span className="flex-1 truncate text-sm">{chat.title}</span>
                )}

                <div className={clsx(
                  "hidden group-hover:flex items-center gap-1",
                  activeId === chat.id ? "flex" : ""
                )}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(chat.id);
                      setEditTitle(chat.title);
                    }}
                    className="p-1 rounded-md hover:bg-white/[0.1] text-text-secondary hover:text-white transition-colors"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="p-1 rounded-md hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-4 border-t border-border-main">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-aura-purple to-aura-cyan flex items-center justify-center text-xs font-bold">
              AS
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Aman Soni</p>
              <p className="text-xs text-text-secondary truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </div>
      </motion.aside>
    </>
  );
}
