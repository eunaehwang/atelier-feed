'use client'

import Image from 'next/image'
import { Collection } from '@/types'

interface HighlightsProps {
  collections: Collection[]
}

export default function Highlights({ collections }: HighlightsProps) {
  if (collections.length === 0) return null

  return (
    <div className="max-w-[935px] mx-auto px-4 py-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-black p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {collection.cover_image ? (
                    <Image
                      src={`/api/images/${encodeURIComponent(collection.cover_image)}`}
                      alt={collection.name}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      {collection.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[64px] truncate text-center">
              {collection.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
