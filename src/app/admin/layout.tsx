import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
              ← 포트폴리오
            </a>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">관리자</span>
            <a href="/admin" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              게시물
            </a>
            <a href="/admin/codes" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              열람 코드
            </a>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
              로그아웃
            </button>
          </form>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
