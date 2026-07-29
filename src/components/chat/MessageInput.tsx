'use client';

import { ArrowUp, Plus, Mic, StopCircle, FileText, Globe, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useChatStore, KnowledgeResource } from '@/store/useChatStore';
import KnowledgeBar from '@/components/knowledge/KnowledgeBar';

interface MessageInputProps {
  onSend: (content: string) => void;
  onStop?: () => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, onStop, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  const { 
    activeId,
    knowledgeByConversation,
    addKnowledgeResource,
    updateKnowledgeResource
  } = useChatStore();
  
  const activeConversationId = activeId || 'default-session';
  const activeResources = knowledgeByConversation[activeConversationId] || [];

  const isUploadingAny = activeResources.some(r => r.status !== 'ready' && r.status !== 'failed');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
    }
  };

  // Close upload menu on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  // Clear toast after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Determine file resource type
  const getResourceType = (filename: string): KnowledgeResource['type'] => {
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    if (ext === '.pdf') return 'pdf';
    if (ext === '.docx') return 'docx';
    if (ext === '.md') return 'md';
    return 'txt';
  };

  // ── Document Ingestion Process attached to active Conversation ──
  const processFileUpload = async (file: File) => {
    const validExtensions = ['.pdf', '.txt', '.md', '.docx'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setToastMessage({ type: 'error', text: 'Unsupported format. Choose PDF, TXT, Markdown, or DOCX.' });
      return;
    }

    const resourceId = crypto.randomUUID();
    const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // 1. STATE: Uploading
    addKnowledgeResource(activeConversationId, {
      id: resourceId,
      conversationId: activeConversationId,
      type: getResourceType(file.name),
      filename: file.name,
      fileSize: formattedSize,
      status: 'uploading',
      progress: 25,
      stageText: 'Uploading file...',
      uploadTime: Date.now(),
    });

    try {
      updateKnowledgeResource(activeConversationId, resourceId, {
        progress: 45,
        stageText: 'Transmitting payload...',
      });

      const formData = new FormData();
      formData.append('file', file);

      // 2. STATE: Processing & Chunking
      updateKnowledgeResource(activeConversationId, resourceId, {
        status: 'processing',
        progress: 65,
        stageText: 'Parsing document...',
      });

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // 3. STATE: Generating Embeddings
      updateKnowledgeResource(activeConversationId, resourceId, {
        status: 'generating_embeddings',
        progress: 85,
        stageText: 'Generating embeddings...',
      });

      const response = await fetch(`${apiBaseUrl}/api/v1/rag/upload-file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Ingestion failed on backend');
      }

      const data = await response.json();

      // 4. STATE: Ready
      updateKnowledgeResource(activeConversationId, resourceId, {
        status: 'ready',
        progress: 100,
        stageText: '✓ Ready',
        totalChunks: data.total_chunks,
        totalPages: data.total_pages,
      });

      setToastMessage({ type: 'success', text: `✓ Ready: ${file.name}` });

    } catch (error: any) {
      console.error('File Ingestion Error:', error);
      updateKnowledgeResource(activeConversationId, resourceId, {
        status: 'failed',
        progress: 0,
        error: error.message || 'Upload failed',
      });
      setToastMessage({ type: 'error', text: `Failed: ${error.message}` });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFileUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleIngestUrlClick = async () => {
    setShowMenu(false);
    const url = window.prompt('Enter webpage URL to ingest (e.g. https://example.com/article):');
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setToastMessage({ type: 'error', text: 'Invalid URL format. Make sure it starts with http:// or https://' });
      return;
    }

    const resourceId = crypto.randomUUID();

    // 1. STATE: Web Crawling
    addKnowledgeResource(activeConversationId, {
      id: resourceId,
      conversationId: activeConversationId,
      type: 'url',
      filename: url,
      url: url,
      fileSize: 'Web Page',
      status: 'uploading',
      progress: 30,
      stageText: 'Fetching webpage...',
      uploadTime: Date.now(),
    });

    try {
      updateKnowledgeResource(activeConversationId, resourceId, {
        status: 'processing',
        progress: 60,
        stageText: 'Extracting readable text...',
      });

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      updateKnowledgeResource(activeConversationId, resourceId, {
        status: 'generating_embeddings',
        progress: 85,
        stageText: 'Generating embeddings...',
      });

      const response = await fetch(`${apiBaseUrl}/api/v1/rag/ingest-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Webpage crawling failed');
      }

      const data = await response.json();

      updateKnowledgeResource(activeConversationId, resourceId, {
        status: 'ready',
        progress: 100,
        stageText: '✓ Ready',
        totalChunks: data.total_chunks,
      });

      setToastMessage({ type: 'success', text: `✓ Webpage indexed!` });

    } catch (error: any) {
      console.error('URL Ingestion Error:', error);
      updateKnowledgeResource(activeConversationId, resourceId, {
        status: 'failed',
        progress: 0,
        error: error.message || 'Webpage ingestion failed',
      });
      setToastMessage({ type: 'error', text: `Error: ${error.message}` });
    }
  };

  return (
    <div className="max-w-[800px] mx-auto w-full relative">
      
      {/* ── Knowledge Bar displaying Conversation Resources ── */}
      <KnowledgeBar conversationId={activeConversationId} />

      {/* ── Toast Notification Banner ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={clsx(
              "absolute -top-10 left-6 right-6 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-medium border shadow-lg backdrop-blur-md z-30",
              toastMessage.type === 'success' && "bg-emerald-950/90 border-emerald-500/30 text-emerald-300",
              toastMessage.type === 'error' && "bg-red-950/90 border-red-500/30 text-red-300",
              toastMessage.type === 'info' && "bg-zinc-900/90 border-white/10 text-zinc-300"
            )}
          >
            {toastMessage.type === 'success' && <CheckCircle2 size={15} />}
            {toastMessage.type === 'error' && <AlertCircle size={15} />}
            {toastMessage.type === 'info' && <Loader2 size={15} className="animate-spin text-white" />}
            <span className="truncate flex-1">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Chat Input Bar ── */}
      <div className="relative flex items-center gap-4 bg-bg-surface border border-white/[0.08] rounded-[28px] px-6 py-2 focus-within:border-white/20 transition-all shadow-2xl group">
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt,.md,.docx"
          className="hidden"
        />

        {/* Attachment button */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => !isUploadingAny && setShowMenu(!showMenu)}
            disabled={isUploadingAny}
            className={clsx(
              "p-1 rounded-full text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors relative",
              isUploadingAny && "cursor-not-allowed opacity-50"
            )}
          >
            {isUploadingAny ? <Loader2 size={22} className="animate-spin text-white" /> : <Plus size={22} />}
          </button>

          {/* Attachment Dropdown */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute bottom-12 left-0 w-56 bg-bg-secondary border border-white/[0.08] rounded-xl p-1.5 shadow-2xl z-50 flex flex-col gap-0.5"
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors text-left"
                >
                  <FileText size={16} />
                  <span>Upload Document</span>
                </button>
                <button
                  onClick={handleIngestUrlClick}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors text-left"
                >
                  <Globe size={16} />
                  <span>Crawl Web URL</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          className="flex-1 bg-transparent border-none outline-none text-[16px] py-3 resize-none max-h-[200px] custom-scrollbar placeholder:text-text-secondary/50"
        />

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors">
            <Mic size={20} />
          </button>
          
          <button
            onClick={disabled ? onStop : handleSend}
            disabled={!content.trim() && !disabled}
            className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              content.trim() || disabled
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-white/[0.05] text-white/20"
            )}
          >
            {disabled ? (
              <StopCircle size={20} className="text-black" />
            ) : (
              <div className="flex items-center justify-center">
                {content.trim() ? <ArrowUp size={20} /> : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 3v18M8 8v8M16 8v8M4 10v4M20 10v4" />
                  </svg>
                )}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
