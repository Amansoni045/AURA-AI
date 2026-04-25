"use client"

import Modal from "../ui/Modal"
import { useChatStore } from "@/store/useChatStore"
import { Sparkles, Moon, Sun, Monitor, Trash2, Shield, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { clsx } from "clsx"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { model, setModel, clearHistory } = useChatStore()
  const { data: session } = useSession()

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      clearHistory()
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-8">
        {/* Profile Section */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-4 flex items-center gap-2">
            <User size={14} /> Account
          </h3>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
            {session ? (
              <div className="flex items-center gap-4">
                {session.user?.image ? (
                  <img src={session.user.image} className="w-12 h-12 rounded-full border border-white/10" alt="Avatar" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-aura-purple to-aura-cyan flex items-center justify-center font-bold">
                    {session.user?.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{session.user?.name}</p>
                  <p className="text-sm text-text-secondary">{session.user?.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">Not signed in. Sign in to sync your chats across devices.</p>
            )}
          </div>
        </section>

        {/* Model Preferences */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-4 flex items-center gap-2">
            <Sparkles size={14} /> AI Model
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'mistral-large-latest', name: 'Aura Intellect', desc: 'Most capable model for complex reasoning' },
              { id: 'gemini-2.0-flash', name: 'Aura Flash', desc: 'Fastest response time' },
              { id: 'llama-3.3-70b-versatile', name: 'Aura Turbo', desc: 'Balanced speed and intelligence' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id as any)}
                className={clsx(
                  "w-full text-left p-3 rounded-xl border transition-all",
                  model === m.id 
                    ? "bg-aura-purple/10 border-aura-purple/50 text-white" 
                    : "bg-white/[0.02] border-white/[0.05] text-text-secondary hover:bg-white/[0.05]"
                )}
              >
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-[10px] opacity-70">{m.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Theme Section (Placeholder for now) */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-4 flex items-center gap-2">
            <Sun size={14} /> Appearance
          </h3>
          <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
            {[
              { id: 'dark', icon: <Moon size={14} />, label: 'Dark' },
              { id: 'light', icon: <Sun size={14} />, label: 'Light' },
              { id: 'system', icon: <Monitor size={14} />, label: 'System' },
            ].map((t) => (
              <button
                key={t.id}
                disabled={t.id !== 'dark'}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all",
                  t.id === 'dark' ? "bg-white/[0.1] text-white shadow-lg" : "text-text-secondary opacity-50 cursor-not-allowed"
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Data Management */}
        <section className="pt-4 border-t border-border-main">
          <h3 className="text-xs uppercase tracking-wider text-red-400 font-bold mb-4 flex items-center gap-2">
            <Shield size={14} /> Data & Privacy
          </h3>
          <button
            onClick={handleClear}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={18} />
              <div className="text-left">
                <p className="text-sm font-medium">Clear Chat History</p>
                <p className="text-[10px] opacity-70">Delete all local and synced conversations</p>
              </div>
            </div>
          </button>
        </section>
      </div>
    </Modal>
  )
}
