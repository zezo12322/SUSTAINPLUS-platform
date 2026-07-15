import type { Metadata } from 'next'
import { PlansManager } from './plans-manager'

export const metadata: Metadata = { title: 'إدارة الخطط' }

export default function AdminPlansPage() {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">إدارة الخطط</h1>
        <p className="text-sm text-gray-400">إنشاء وتعديل خطط الاشتراك والأسعار</p>
      </div>
      <PlansManager />
    </div>
  )
}
