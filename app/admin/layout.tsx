import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <main className="py-8">
        {children}
      </main>
    </div>
  )
}
