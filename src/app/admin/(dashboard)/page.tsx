import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminPostList from '@/components/admin/AdminPostList'
import { Post, Collection } from '@/types'

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*, collection:collections(name), images:post_images(id, order_index)')
    .order('order_index', { ascending: true })
  return (data ?? []) as Post[]
}

async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('*')
    .order('order_index', { ascending: true })
  return data ?? []
}

export default async function AdminPage() {
  const [posts, collections] = await Promise.all([getPosts(), getCollections()])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">게시물 관리</h1>
        <Link
          href="/admin/posts/new"
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
        >
          + 새 게시물
        </Link>
      </div>

      <AdminPostList posts={posts} collections={collections} />
    </div>
  )
}
