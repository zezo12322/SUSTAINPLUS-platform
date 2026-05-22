import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" dir="rtl">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 h-14 flex items-center px-6 gap-3 flex-shrink-0">
          <i className="fa-solid fa-shield text-primary-600" />
          <span className="text-sm font-semibold text-gray-700">لوحة الإدارة</span>
          <span className="mr-auto text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
            Admin
          </span>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
