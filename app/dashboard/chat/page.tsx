import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDateAr } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'استشاراتي' }

export default async function ChatListPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const sessions = await prisma.chatSession.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true, role: true },
      },
    },
  })

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">استشاراتي</h1>
          <p className="text-sm text-gray-400">{sessions.length} محادثة</p>
        </div>
        <Link
          href="/dashboard/chat/new"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-plus" />
          استشارة جديدة
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
          <i className="fa-regular fa-comments text-gray-200 text-5xl mb-5" />
          <h2 className="text-lg font-bold text-gray-700 mb-2">لا توجد استشارات بعد</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            ابدأ استشارتك البيئية الأولى وستجدها هنا للرجوع إليها في أي وقت.
          </p>
          <Link
            href="/dashboard/chat/new"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <i className="fa-solid fa-plus" />
            ابدأ استشارة جديدة
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const lastMsg = s.messages[0]
            return (
              <Link
                key={s.id}
                href={`/dashboard/chat/${s.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-comments text-primary-600 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-gray-800 truncate">
                        {s.titleAr || 'محادثة بدون عنوان'}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatDateAr(s.updatedAt)}
                      </span>
                    </div>
                    {lastMsg && (
                      <p className="text-sm text-gray-400 truncate mt-0.5">
                        {lastMsg.role === 'USER' ? 'أنت: ' : 'المستشار: '}
                        {lastMsg.content}
                      </p>
                    )}
                  </div>
                  <i className="fa-solid fa-chevron-left text-gray-300 mt-1 flex-shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
