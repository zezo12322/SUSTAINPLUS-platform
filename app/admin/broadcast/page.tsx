import type { Metadata } from 'next'
import { BroadcastForm } from './broadcast-form'

export const metadata: Metadata = { title: 'بثّ إشعار' }

export default function AdminBroadcastPage() {
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">بثّ إشعار</h1>
        <p className="text-sm text-gray-400">أرسل إشعاراً داخل المنصّة لمجموعة من المستخدمين</p>
      </div>
      <BroadcastForm />
    </div>
  )
}
