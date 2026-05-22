'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'الرئيسية', icon: 'fa-gauge' },
  { href: '/dashboard/chat', label: 'استشاراتي', icon: 'fa-comments' },
  { href: '/dashboard/expert', label: 'تصعيد لخبير', icon: 'fa-user-tie' },
  { href: '/dashboard/billing', label: 'اشتراكي والفواتير', icon: 'fa-credit-card' },
]

const adminItems = [
  { href: '/admin', label: 'لوحة الإدارة', icon: 'fa-chart-line' },
  { href: '/admin/users', label: 'إدارة المستخدمين', icon: 'fa-users' },
  { href: '/admin/knowledge-base', label: 'قاعدة المعرفة', icon: 'fa-book' },
  { href: '/admin/expert-cases', label: 'حالات الخبراء', icon: 'fa-briefcase' },
  { href: '/admin/payments', label: 'المدفوعات', icon: 'fa-money-bill' },
]

interface DashboardSidebarProps {
  onClose?: () => void
}

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-l border-gray-100 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S+</span>
          </div>
          <div>
            <p className="text-sm font-bold text-primary-700 leading-tight">سستين بلس</p>
            <p className="text-[10px] text-gray-400 leading-tight">منصة الاستشارات</p>
          </div>
        </Link>
      </div>

      {/* New chat CTA */}
      <div className="p-4">
        <Link
          href="/dashboard/chat/new"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-plus" />
          استشارة جديدة
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'sidebar-nav-item',
                (item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href))
                  ? 'active'
                  : ''
              )}
            >
              <i className={`fa-solid ${item.icon} w-4 text-primary-600`} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Admin section */}
        {isAdmin && (
          <div className="mt-6">
            <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              الإدارة
            </p>
            <div className="space-y-0.5 mt-1">
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'sidebar-nav-item',
                    pathname.startsWith(item.href) ? 'active' : ''
                  )}
                >
                  <i className={`fa-solid ${item.icon} w-4 text-primary-600`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User info at bottom */}
      {session?.user && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-user text-primary-600 text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
