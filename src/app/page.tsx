import { createClient } from '@/lib/supabase/server'
import ProfileHeader from '@/components/ProfileHeader'
import Highlights from '@/components/Highlights'
import PortfolioClient from '@/components/PortfolioClient'
import { Post, Collection } from '@/types'

export const revalidate = 60

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      collection:collections(*),
      images:post_images(*)
    `)
    .order('order_index', { ascending: true })
    .order('order_index', { ascending: true, foreignTable: 'post_images' })

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

export default async function Home() {
  const [posts, collections] = await Promise.all([getPosts(), getCollections()])

  return (
    <main className="max-w-[935px] mx-auto">
      <ProfileHeader
        postCount={posts.length}
        collectionCount={collections.length}
      />
      <Highlights collections={collections} />
      <PortfolioClient posts={posts} />
    </main>
  )
}
