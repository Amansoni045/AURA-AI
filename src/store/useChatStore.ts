import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  updatedAt: number;
}

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  isStreaming: boolean;
  model: string;
  sidebarCollapsed: boolean;
  userId: string | null;
  
  // Actions
  createChat: () => void;
  deleteChat: (id: string) => void;
  setActiveChat: (id: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'timestamp'>) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  renameChat: (id: string, title: string) => void;
  setConversations: (conversations: Conversation[], userId?: string | null) => void;
  setModel: (model: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      activeId: null,
      isStreaming: false,
      model: 'mistral-large-latest',
      sidebarCollapsed: false,
      userId: null,

      createChat: () => {
        set((state) => {
          const firstChat = state.conversations[0];
          if (firstChat && firstChat.messages.length === 0) {
            return { activeId: firstChat.id };
          }

          const id = crypto.randomUUID();
          const newChat: Conversation = {
            id,
            title: 'New Chat',
            messages: [],
            model: state.model,
            updatedAt: Date.now(),
          };
          
          return {
            conversations: [newChat, ...state.conversations],
            activeId: id,
          };
        });
      },

      deleteChat: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          const nextActiveId = state.activeId === id 
            ? (newConversations[0]?.id || null) 
            : state.activeId;
          return {
            conversations: newConversations,
            activeId: nextActiveId,
          };
        });
      },

      setActiveChat: (id) => set({ activeId: id }),

      addMessage: (chatId, message) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === chatId) {
              const newMessage: Message = {
                ...message,
                timestamp: Date.now(),
              } as Message;
              let title = c.title;
              if (c.messages.length === 0 && message.role === 'user') {
                title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
              }

              return {
                ...c,
                title,
                messages: [...c.messages, newMessage],
                updatedAt: Date.now(),
              };
            }
            return c;
          }),
        }));
      },

      updateMessage: (chatId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === chatId) {
              return {
                ...c,
                messages: c.messages.map((m) => 
                  m.id === messageId ? { ...m, content } : m
                ),
              };
            }
            return c;
          }),
        }));
      },

      renameChat: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) => 
            c.id === id ? { ...c, title } : c
          ),
        }));
      },

      setConversations: (conversations, userId = null) => set({ conversations, userId }),
      setModel: (model) => set({ model }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      clearHistory: () => set({ conversations: [], activeId: null }),
    }),
    {
      name: 'aura-chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        activeId: state.activeId,
        model: state.model,
        sidebarCollapsed: state.sidebarCollapsed,
        userId: state.userId,
      }),
    }
  )
);
