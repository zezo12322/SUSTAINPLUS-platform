'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { NotificationBell } from '@/components/layout/notification-bell'
import { useSession } from 'next-auth/react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop permanent, mobile drawer */}
      <div
        className={`fixed lg:relative inset-y-0 right-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <i className="fa-solid fa-bars" />
          </button>

          <div className="flex items-center gap-3 mr-auto">
            {/* Notifications bell */}
            <NotificationBell />

            {/* User menu */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user text-primary-600 text-xs" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-800">{session?.user?.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
