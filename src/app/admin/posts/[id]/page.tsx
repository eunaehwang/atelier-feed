import { createClient } from '@/lib/supabase/server'
import PostEditor from '@/components/admin/PostEditor'
import { Post, Collection } from '@/types'
import { notFound } from 'next/navigation'

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*, images:post_images(*)')
    .eq('id', id)
    .single()
  return data as Post | null
}

async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('*')
    .order('order_index', { ascending: true })
  return data ?? []
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [post, collections] = await Promise.all([getPost(id), getCollections()])
  if (!post) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">게시물 편집</h1>
      <PostEditor post={post} collections={collections} />
    </div>
  )
}
