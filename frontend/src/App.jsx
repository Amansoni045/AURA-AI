import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, User, Sparkles, PlusCircle, 
  Menu, ChevronDown, MessageSquare, 
  Settings, Search, Globe, Github, Info,
  Trash2, X, Shield, Moon
} from 'lucide-react';
import './App.css';

const AuraLogo = () => (
  <div className="aura-logo-container">
    <div className="aura-glow"></div>
    <Sparkles size={32} className="aura-icon" strokeWidth={2.5} />
  </div>
);

const App = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Aura-1 Ultra');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversations from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('aura_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
      } catch (e) {
        console.error("Failed to parse saved chats");
      }
    }
  }, []);

  // Save conversations to LocalStorage
  useEffect(() => {
    localStorage.setItem('aura_chats', JSON.stringify(conversations));
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentChatId]);

  const currentChat = conversations.find(c => c.id === currentChatId) || null;
  const messages = currentChat ? currentChat.messages : [];

  const handleNewChat = () => {
    setSelectedModel('Aura-1 Ultra');
    setCurrentChatId(null);
    setInput('');
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    let activeChatId = currentChatId;
    let updatedConversations = [...conversations];

    // Create new chat if none is active
    if (!activeChatId) {
      activeChatId = Date.now().toString();
      const newChat = {
        id: activeChatId,
        title: input.length > 30 ? input.substring(0, 30) + '...' : input,
        messages: [userMessage],
        timestamp: new Date().toISOString()
      };
      updatedConversations = [newChat, ...conversations];
      setCurrentChatId(activeChatId);
    } else {
      updatedConversations = conversations.map(c => {
        if (c.id === activeChatId) {
          return { ...c, messages: [...c.messages, userMessage] };
        }
        return c;
      });
    }

    setConversations(updatedConversations);
    setInput('');
    setIsLoading(true);

    try {
      const chatToUpdate = updatedConversations.find(c => c.id === activeChatId);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatToUpdate.messages }),
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.content };
      
      setConversations(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return { ...c, messages: [...c.messages, assistantMessage] };
        }
        return c;
      }));
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'Aura encountered a connection issue. Please verify your backend server.' };
      setConversations(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return { ...c, messages: [...c.messages, errorMessage] };
        }
        return c;
      }));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const deleteChat = (e, id) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) setCurrentChatId(null);
  };

  const clearAllHistory = () => {
    setConversations([]);
    setCurrentChatId(null);
    setIsSettingsOpen(false);
  };

  return (
    <div className={`app-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="sidebar"
      >
        <div className="sidebar-content">
          <div className="sidebar-top">
            <button className="new-chat-btn" onClick={handleNewChat}>
              <PlusCircle size={18} />
              <span>New Conversation</span>
            </button>
            
            <div className="history-section">
              <p className="section-title">History</p>
              <div className="history-list">
                {conversations.length === 0 ? (
                  <p className="no-history">No conversations yet.</p>
                ) : (
                  conversations.map(chat => (
                    <div 
                      key={chat.id} 
                      className={`history-item ${currentChatId === chat.id ? 'active' : ''}`}
                      onClick={() => setCurrentChatId(chat.id)}
                    >
                      <MessageSquare size={16} />
                      <span className="truncate">{chat.title}</span>
                      <Trash2 
                        size={14} 
                        className="delete-icon" 
                        onClick={(e) => deleteChat(e, chat.id)} 
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="sidebar-bottom">
            <div className="sidebar-nav-item" onClick={() => setIsSettingsOpen(true)}>
              <Settings size={18} />
              <span>Settings</span>
            </div>
            <div className="user-profile-card">
              <div className="user-avatar">AS</div>
              <div className="user-info">
                <span className="user-name">Aman Soni</span>
                <span className="user-plan">Pro Member</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Viewport */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button 
              className="icon-btn sidebar-toggle" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <div className="model-chip" onClick={() => setSelectedModel(prev => prev.includes('Ultra') ? 'Aura-1 Turbo' : 'Aura-1 Ultra')}>
              <span className="model-name">{selectedModel}</span>
              <ChevronDown size={14} className="ml-1" />
            </div>
          </div>
          
          <div className="header-right">
            <button className="icon-btn"><Search size={18} /></button>
            <button className="icon-btn" onClick={() => setIsSettingsOpen(true)}><Info size={18} /></button>
          </div>
        </header>

        <div className="chat-viewport">
          <div className="chat-stage">
            <AnimatePresence initial={false}>
              {!currentChatId ? (
                <div className="welcome-screen">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="welcome-box"
                  >
                    <AuraLogo />
                    <h1 className="welcome-title">How can Aura help?</h1>
                    
                    <div className="suggestion-container">
                      <div className="suggestion-card" onClick={() => setInput("Plan a 3-day trip to Tokyo")}>
                        <Globe size={18} />
                        <p>Plan a 3-day trip to Tokyo</p>
                      </div>
                      <div className="suggestion-card" onClick={() => setInput("Explain quantum entanglement like I'm five")}>
                        <Sparkles size={18} />
                        <p>Explain quantum entanglement</p>
                      </div>
                      <div className="suggestion-card" onClick={() => setInput("Write a Python script to scrape news")}>
                        <Github size={18} />
                        <p>Write a Python script</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="message-thread">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`message-row ${msg.role}`}
                    >
                      <div className="message-box">
                        <div className={`message-avatar ${msg.role}`}>
                          {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                        </div>
                        <div className="message-text">
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="message-row assistant">
                      <div className="message-box">
                        <div className="message-avatar assistant">
                          <Sparkles size={16} />
                        </div>
                        <div className="aura-typing">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        <footer className="footer-container">
          <div className="input-area-wrapper">
            <div className="input-container-glass">
              <form className="input-composer" onSubmit={handleSend}>
                <textarea
                  ref={inputRef}
                  className="composer-textarea"
                  rows="1"
                  placeholder="Ask Aura anything..."
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button 
                  type="submit" 
                  className={`aura-send-btn ${input.trim() ? 'active' : ''}`}
                  disabled={!input.trim() || isLoading}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
            <p className="legal-notice">
              Aura AI is an experimental project for Generative AI exploration.
            </p>
          </div>
        </footer>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="settings-modal glass"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Settings</h2>
                <button className="close-btn" onClick={() => setIsSettingsOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="setting-item">
                  <div className="setting-info">
                    <Moon size={18} />
                    <span>Theme</span>
                  </div>
                  <span className="setting-value">Dark (Default)</span>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <Shield size={18} />
                    <span>Data Privacy</span>
                  </div>
                  <span className="setting-value">Strict</span>
                </div>

                <div className="setting-danger-zone">
                  <p className="danger-title">Danger Zone</p>
                  <button className="danger-btn" onClick={clearAllHistory}>
                    <Trash2 size={16} />
                    Clear all conversations
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <p>Aura AI v1.0.4 • Built with LangChain & React</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
