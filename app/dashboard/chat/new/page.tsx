import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getMonthYear } from '@/lib/utils'
import { ChatInterface } from '@/components/chat/chat-interface'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'استشارة جديدة' }

export default async function NewChatPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id
  const monthYear = getMonthYear()

  const [userWithSub, usage] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: { include: { plan: true } } },
    }),
    prisma.usageRecord.findUnique({
      where: { userId_monthYear: { userId, monthYear } },
    }),
  ])

  const plan = userWithSub?.subscription?.plan
  const used = usage?.consultationsUsed ?? 0
  const limit = plan?.consultationsPerMonth ?? 3
  const remaining = Math.max(0, limit - used)
  const canChat = remaining > 0

  return (
    <ChatInterface
      userId={userId}
      sessionId={null}
      planSlug={plan?.slug ?? 'free'}
      used={used}
      limit={limit}
      remaining={remaining}
      canChat={canChat}
      messages={[]}
    />
  )
}
