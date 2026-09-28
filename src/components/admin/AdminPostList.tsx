'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post, Collection } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminPostListProps {
  posts: Post[]
  collections: Collection[]
}

export default function AdminPostList({ posts, collections }: AdminPostListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (post: Post) => {
    if (!confirm(`"${post.title}" 게시물을 삭제하시겠습니까?`)) return
    setDeleting(post.id)

    const supabase = createClient()
    await supabase.from('post_images').delete().eq('post_id', post.id)
    await supabase.from('posts').delete().eq('id', post.id)

    setDeleting(null)
    router.refresh()
  }

  const collectionMap = Object.fromEntries(collections.map((c) => [c.id, c.name]))

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>게시물이 없습니다.</p>
        <Link href="/admin/posts/new" className="text-sm text-gray-900 dark:text-white underline mt-2 inline-block">
          첫 게시물 만들기
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 shadow-sm"
        >
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
            <img
              src={`https://placehold.co/48x48/e8e0d8/8a7a6a?text=${encodeURIComponent(post.title.charAt(0))}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {post.title}
              </p>
              {post.is_restricted && (
                <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded">
                  코드 전용
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {post.collection_id ? collectionMap[post.collection_id] ?? '컬렉션' : '컬렉션 없음'}
              {' · '}
              {post.tab_type === 'process' ? '작업과정' : '전체'}
              {' · '}
              이미지 {(post.images as { id: string }[] | undefined)?.length ?? 0}장
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/admin/posts/${post.id}`}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              편집
            </Link>
            <button
              onClick={() => handleDelete(post)}
              disabled={deleting === post.id}
              className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
            >
              {deleting === post.id ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
