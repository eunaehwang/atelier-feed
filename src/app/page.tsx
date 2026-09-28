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

async function getIsAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch {
    return false
  }
}

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  const [posts, collections, isAdmin, params] = await Promise.all([
    getPosts(),
    getCollections(),
    getIsAdmin(),
    searchParams,
  ])

  const codeParam = params.code
  const urlCode = typeof codeParam === 'string' ? codeParam : null

  return (
    <main className="max-w-[935px] mx-auto">
      <ProfileHeader
        postCount={posts.length}
        collectionCount={collections.length}
        isAdmin={isAdmin}
        urlCode={urlCode}
      />
      <Highlights />
      <PortfolioClient posts={posts} />
    </main>
  )
}
