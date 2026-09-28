'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { Post } from '@/types'
import CodeModal from './CodeModal'

interface PostModalProps {
  post: Post
  onClose: () => void
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)

  const images = post.images ?? []
  const total = images.length

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i))
  }, [])

  const next = useCallback(() => {
    setCurrentIndex((i) => (i < total - 1 ? i + 1 : i))
  }, [total])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const delta = touchStart - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev()
    }
    setTouchStart(null)
  }

  const currentImage = images[currentIndex]
  const imageSrc = currentImage
    ? `/api/images/${encodeURIComponent(currentImage.storage_path)}`
    : `https://placehold.co/800x800/e8e0d8/8a7a6a?text=${encodeURIComponent(post.title)}`

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors md:hidden"
          >
            ×
          </button>

          {/* Image area */}
          <div
            className="relative flex-shrink-0 w-full md:w-[60%] aspect-square bg-gray-100 dark:bg-gray-800"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {post.is_restricted && accessDenied ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm text-center">열람 코드가 필요한 게시물입니다</p>
                <button
                  onClick={() => setShowCodeModal(true)}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-80 transition-opacity"
                >
                  열람 코드 입력
                </button>
              </div>
            ) : (
              <>
                <Image
                  src={imageSrc}
                  alt={post.title}
                  fill
                  className="object-contain"
                  onError={() => {
                    if (post.is_restricted) setAccessDenied(true)
                  }}
                />

                {/* Navigation arrows */}
                {total > 1 && (
                  <>
                    {currentIndex > 0 && (
                      <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {currentIndex < total - 1 && (
                      <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            i === currentIndex ? 'bg-blue-500' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Lock badge */}
            {post.is_restricted && !accessDenied && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Info area */}
          <div className="flex flex-col p-5 md:p-6 overflow-y-auto flex-1">
            {/* Desktop close */}
            <button
              onClick={onClose}
              className="hidden md:flex self-end w-8 h-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img
                  src="https://placehold.co/32x32/e8e0d8/6b6b6b?text=J"
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">juhyuntae_design</p>
                {post.collection?.name && (
                  <p className="text-xs text-gray-500">{post.collection.name}</p>
                )}
              </div>
            </div>

            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h2>

            {post.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {post.description}
              </p>
            )}

            {post.is_restricted && !accessDenied && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  일부 이미지는 열람 코드가 필요합니다
                </p>
                <button
                  onClick={() => setShowCodeModal(true)}
                  className="text-xs font-semibold text-gray-900 dark:text-white underline"
                >
                  코드 입력하기
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-auto pt-4">
              {new Date(post.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          onSuccess={() => {
            setShowCodeModal(false)
            setAccessDenied(false)
          }}
        />
      )}
    </>
  )
}
