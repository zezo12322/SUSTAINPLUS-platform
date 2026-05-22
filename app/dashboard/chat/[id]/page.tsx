import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getMonthYear } from '@/lib/utils'
import { ChatInterface } from '@/components/chat/chat-interface'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'محادثة' }

export default async function ChatSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id

  const [chatSession, userWithSub, usage] = await Promise.all([
    prisma.chatSession.findUnique({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, role: true, content: true, isComplex: true, createdAt: true },
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: { include: { plan: true } } },
    }),
    prisma.usageRecord.findUnique({
      where: { userId_monthYear: { userId, monthYear: getMonthYear() } },
    }),
  ])

  if (!chatSession) notFound()

  const plan = userWithSub?.subscription?.plan
  const used = usage?.consultationsUsed ?? 0
  const limit = plan?.consultationsPerMonth ?? 3
  const remaining = Math.max(0, limit - used)
  const canChat = remaining > 0

  return (
    <ChatInterface
      userId={userId}
      sessionId={id}
      planSlug={plan?.slug ?? 'free'}
      used={used}
      limit={limit}
      remaining={remaining}
      canChat={canChat}
      messages={chatSession.messages.map((m) => ({
        id: m.id,
        role: m.role as 'USER' | 'ASSISTANT',
        content: m.content,
        isComplex: m.isComplex,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  )
}
