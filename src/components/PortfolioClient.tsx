'use client'

import { useState } from 'react'
import { Post } from '@/types'
import PostGrid from './PostGrid'

interface PortfolioClientProps {
  posts: Post[]
}

export default function PortfolioClient({ posts }: PortfolioClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'collection' | 'process'>('all')

  return (
    <PostGrid
      posts={posts}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}
