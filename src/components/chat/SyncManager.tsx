"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useChatStore } from "@/store/useChatStore"
import { getConversations, saveConversation } from "@/app/actions/chat"

export default function SyncManager() {
  const { data: session, status } = useSession()
  const { conversations, setConversations, activeId } = useChatStore()

  // Load conversations from server on login
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchChats = async () => {
        const serverChats = await getConversations()
        if (serverChats && serverChats.length > 0) {
          // Format server chats to match store types
          const formattedChats = serverChats.map((c: any) => ({
            id: c.id,
            title: c.title,
            model: c.model,
            updatedAt: c.updatedAt.getTime(),
            messages: c.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: m.timestamp.getTime(),
            })),
          }))
          setConversations(formattedChats)
        }
      }
      fetchChats()
    }
  }, [status, session?.user?.id])

  // Sync current conversation to server on changes
  useEffect(() => {
    if (status === "authenticated" && activeId) {
      const activeChat = conversations.find(c => c.id === activeId)
      if (activeChat && activeChat.messages.length > 0) {
        const timer = setTimeout(() => {
          saveConversation(activeChat)
        }, 1000) // Debounce save
        return () => clearTimeout(timer)
      }
    }
  }, [conversations, activeId, status])

  return null
}
