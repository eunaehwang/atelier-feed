'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Post } from '@/types'
import PostModal from './PostModal'

interface PostGridProps {
  posts: Post[]
  activeTab: 'all' | 'collection' | 'process'
  onTabChange: (tab: 'all' | 'collection' | 'process') => void
}

const PLACEHOLDER_COLORS = [
  'e8e0d8', 'd4c5b0', 'c4b49a', 'b8a898', 'a09080',
  'e0d4c8', 'd8ccc0', 'ccc0b4', 'c0b4a8', 'b4a89c',
]

export default function PostGrid({ posts, activeTab, onTabChange }: PostGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'all') return true
    if (activeTab === 'collection') return !!post.collection_id
    if (activeTab === 'process') return post.tab_type === 'process'
    return true
  })

  return (
    <>
      {/* Tabs */}
      <div className="max-w-[935px] mx-auto border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          {([
            { key: 'all', label: '전체', icon: '⊞' },
            { key: 'collection', label: '컬렉션', icon: '◫' },
            { key: 'process', label: '작업과정', icon: '⊡' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold tracking-wider uppercase border-t-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[935px] mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            게시물이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 md:gap-1">
            {filteredPosts.map((post, index) => {
              const firstImage = post.images?.[0]
              const colorIndex = index % PLACEHOLDER_COLORS.length
              const placeholderColor = PLACEHOLDER_COLORS[colorIndex]

              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="relative aspect-[3/4] overflow-hidden group bg-gray-100 dark:bg-gray-900"
                >
                  {firstImage ? (
                    <Image
                      src={`/api/images/${encodeURIComponent(firstImage.storage_path)}`}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={`https://placehold.co/300x400/${placeholderColor}/8a7a6a?text=${encodeURIComponent(post.title.charAt(0))}`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  )}

                  {/* Restricted overlay */}
                  {post.is_restricted && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full p-1">
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Multiple images indicator */}
                  {post.images && post.images.length > 1 && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full p-1">
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  )
}
