'use client';

import { useChatStore } from '@/store/useChatStore';
import MessageItem from '@/components/chat/MessageItem';
import MessageInput from '@/components/chat/MessageInput';
import { useEffect, useRef } from 'react';
import { Plus, Edit2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatContainer() {
  const { activeId, conversations, isStreaming, addMessage, updateMessage, setStreaming, model } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeChat = conversations.find(c => c.id === activeId);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages.length, activeChat?.messages[activeChat?.messages.length - 1]?.content]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    let currentId = activeId;

    // If no active chat, create one first
    if (!currentId) {
      const newChatId = crypto.randomUUID();
      const newChat = {
        id: newChatId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        model: model,
        updatedAt: Date.now(),
      };
      
      // We manually update the store state to avoid waiting for a re-render
      useChatStore.setState((state) => ({
        conversations: [newChat, ...state.conversations],
        activeId: newChatId,
      }));
      currentId = newChatId;
    }

    // Add user message
    const userMsgId = crypto.randomUUID();
    addMessage(currentId, { id: userMsgId, role: 'user', content });

    // Add empty assistant message for streaming
    const assistantMsgId = crypto.randomUUID();
    addMessage(currentId, { id: assistantMsgId, role: 'assistant', content: '' });
    
    setStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const currentMessages = useChatStore.getState().conversations
        .find(c => c.id === currentId)?.messages
        .filter(m => m.content !== '' || m.id !== assistantMsgId) // Exclude current empty assistant message
        .map(m => ({ role: m.role, content: m.content })) || [];

      // Ensure we include the new user message but not the empty assistant message
      const messagesToSend = currentMessages.filter(m => m.role === 'user' || m.content !== '');

      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend,
          model: model,
          stream: true
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to fetch from backend');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
            
            const dataStr = trimmedLine.slice(6);
            if (dataStr === '[DONE]') break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                let errorMsg = `Error: ${data.error}`;
                const errLower = data.error.toLowerCase();
                if (errLower.includes('quota') || errLower.includes('429') || errLower.includes('404') || errLower.includes('not found') || errLower.includes('not supported')) {
                  errorMsg = "🚫 This model is currently unavailable or your free limit has been reached. Please switch to 'Aura Turbo (Llama)' or 'Aura Intellect (Mistral)' at the top to continue!";
                }
                updateMessage(currentId, assistantMsgId, errorMsg);
                break;
              }
              if (data.content) {
                accumulatedContent += data.content;
                updateMessage(currentId, assistantMsgId, accumulatedContent);
              }
            } catch (e) {
              console.error('Error parsing SSE data', e, dataStr);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        console.error('Chat error:', error);
        let errorMsg = `Failed to connect: ${error.message}`;
        const errLower = error.message.toLowerCase();
        if (errLower.includes('quota') || errLower.includes('429') || errLower.includes('404') || errLower.includes('not found')) {
          errorMsg = "🚫 Model unavailable or tokens exhausted. Switch to another provider (Llama or Mistral) at the top to keep chatting!";
        }
        updateMessage(currentId, assistantMsgId, errorMsg);
      }
    } finally {
      setStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  if (!activeId || (activeChat && activeChat.messages.length === 0)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[800px] space-y-12"
        >
          <h1 className="text-4xl md:text-5xl font-medium text-center tracking-tight text-white/90">
            What are you working on?
          </h1>

          <div className="space-y-6 w-full">
            <MessageInput onSend={handleSendMessage} onStop={handleStopGeneration} disabled={isStreaming} />
            
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: <Plus size={16} />, label: "Create an image" },
                { icon: <Edit2 size={16} />, label: "Write or edit" },
                { icon: <Globe size={16} />, label: "Look something up" },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(btn.label)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/[0.08] hover:bg-white/[0.05] text-sm text-text-secondary hover:text-white transition-all"
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative h-[calc(100vh-3.5rem)] overflow-hidden w-full">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar w-full"
      >
        <div className="pb-40 w-full">
          {activeChat?.messages.map((msg, idx) => (
            <MessageItem 
              key={msg.id} 
              message={msg} 
              isLast={idx === activeChat.messages.length - 1} 
              isStreaming={isStreaming && idx === activeChat.messages.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent pt-12 pb-6 px-4 z-10">
        <MessageInput onSend={handleSendMessage} onStop={handleStopGeneration} disabled={isStreaming} />
        <p className="text-[10px] text-center text-text-secondary mt-3">
          AURA-AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
