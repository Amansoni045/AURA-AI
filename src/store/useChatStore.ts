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

export interface KnowledgeResource {
  id: string;
  conversationId: string;
  type: 'pdf' | 'txt' | 'md' | 'docx' | 'url' | 'image' | 'audio' | 'video';
  filename: string;
  fileSize?: string;
  url?: string;
  status: 'uploading' | 'processing' | 'chunking' | 'generating_embeddings' | 'indexing' | 'ready' | 'failed' | 'queued';
  progress: number;
  stageText: string;
  error?: string;
  uploadTime: number;
  totalChunks?: number;
  totalPages?: number;
}

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  isStreaming: boolean;
  model: string;
  sidebarCollapsed: boolean;
  userId: string | null;
  
  // Knowledge Workspace States (Mapped per conversationId)
  knowledgeByConversation: Record<string, KnowledgeResource[]>;
  
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
  
  // Knowledge Workspace Actions
  addKnowledgeResource: (conversationId: string, resource: KnowledgeResource) => void;
  updateKnowledgeResource: (conversationId: string, resourceId: string, updates: Partial<KnowledgeResource>) => void;
  removeKnowledgeResource: (conversationId: string, resourceId: string) => void;
  renameKnowledgeResource: (conversationId: string, resourceId: string, newName: string) => void;
  clearKnowledgeResources: (conversationId: string) => void;
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
      
      // Knowledge state map
      knowledgeByConversation: {},

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
            
          const updatedKnowledge = { ...state.knowledgeByConversation };
          delete updatedKnowledge[id];

          return {
            conversations: newConversations,
            activeId: nextActiveId,
            knowledgeByConversation: updatedKnowledge,
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
      clearHistory: () => set({ conversations: [], activeId: null, knowledgeByConversation: {} }),

      // ── Knowledge Workspace Action Implementations ──
      addKnowledgeResource: (conversationId, resource) => {
        set((state) => {
          const list = state.knowledgeByConversation[conversationId] || [];
          const exists = list.some((r) => r.id === resource.id || r.filename === resource.filename);
          
          const updatedList = exists
            ? list.map((r) => (r.filename === resource.filename ? { ...r, ...resource } : r))
            : [...list, resource];

          return {
            knowledgeByConversation: {
              ...state.knowledgeByConversation,
              [conversationId]: updatedList,
            },
          };
        });
      },

      updateKnowledgeResource: (conversationId, resourceId, updates) => {
        set((state) => {
          const list = state.knowledgeByConversation[conversationId] || [];
          const updatedList = list.map((r) => (r.id === resourceId ? { ...r, ...updates } : r));

          return {
            knowledgeByConversation: {
              ...state.knowledgeByConversation,
              [conversationId]: updatedList,
            },
          };
        });
      },

      removeKnowledgeResource: (conversationId, resourceId) => {
        set((state) => {
          const list = state.knowledgeByConversation[conversationId] || [];
          const updatedList = list.filter((r) => r.id !== resourceId);

          return {
            knowledgeByConversation: {
              ...state.knowledgeByConversation,
              [conversationId]: updatedList,
            },
          };
        });
      },

      renameKnowledgeResource: (conversationId, resourceId, newName) => {
        set((state) => {
          const list = state.knowledgeByConversation[conversationId] || [];
          const updatedList = list.map((r) => (r.id === resourceId ? { ...r, filename: newName } : r));

          return {
            knowledgeByConversation: {
              ...state.knowledgeByConversation,
              [conversationId]: updatedList,
            },
          };
        });
      },

      clearKnowledgeResources: (conversationId) => {
        set((state) => {
          const updatedMap = { ...state.knowledgeByConversation };
          delete updatedMap[conversationId];

          return {
            knowledgeByConversation: updatedMap,
          };
        });
      },
    }),
    {
      name: 'aura-chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        activeId: state.activeId,
        model: state.model,
        sidebarCollapsed: state.sidebarCollapsed,
        userId: state.userId,
        knowledgeByConversation: state.knowledgeByConversation,
      }),
    }
  )
);
