"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getConversations() {
  const session = await auth()
  if (!session?.user?.id) return []

  return await prisma.conversation.findMany({
    where: { userId: session.user.id },
    include: { messages: true },
    orderBy: { updatedAt: "desc" },
  })
}

export async function saveConversation(conversation: any) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { id, title, model, messages } = conversation

  return await prisma.conversation.upsert({
    where: { id },
    update: {
      title,
      model,
      updatedAt: new Date(),
      messages: {
        deleteMany: {},
        create: messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
        })),
      },
    },
    create: {
      id,
      title,
      model,
      userId: session.user.id,
      messages: {
        create: messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
        })),
      },
    },
  })
}

export async function deleteConversation(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  return await prisma.conversation.delete({
    where: { id, userId: session.user.id },
  })
}
