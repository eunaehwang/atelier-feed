import { createClient } from '@/lib/supabase/server'
import PostEditor from '@/components/admin/PostEditor'
import { Collection } from '@/types'

async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('*')
    .order('order_index', { ascending: true })
  return data ?? []
}

export default async function NewPostPage() {
  const collections = await getCollections()
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">새 게시물</h1>
      <PostEditor collections={collections} />
    </div>
  )
}
