'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import CodeModal from './CodeModal'

interface ProfileHeaderProps {
  postCount: number
  collectionCount: number
  isAdmin?: boolean
  urlCode?: string | null
}

export default function ProfileHeader({ postCount, collectionCount, isAdmin, urlCode }: ProfileHeaderProps) {
  const [showCodeModal, setShowCodeModal] = useState(false)

  // Auto-open code modal if ?code= is in the URL
  useEffect(() => {
    if (urlCode) {
      setShowCodeModal(true)
    }
  }, [urlCode])

  return (
    <>
      <div className="max-w-[935px] mx-auto px-4 pt-8 pb-4">
        {/* Admin link — only visible when logged in */}
        {isAdmin && (
          <div className="flex justify-end mb-2">
            <a
              href="/admin"
              className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              관리자
            </a>
          </div>
        )}

        {/* Desktop layout */}
        <div className="flex items-center gap-8 md:gap-16">
          {/* Profile image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden bg-gray-200 ring-2 ring-gray-200">
              <Image
                src="https://placehold.co/144x144/e8e0d8/6b6b6b?text=JHT"
                alt="주현태 프로필"
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name + button row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-xl font-light text-gray-900 dark:text-white tracking-wide">
                juhyuntae_design
              </h1>
              <button
                onClick={() => setShowCodeModal(true)}
                className="text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                열람 코드 입력
              </button>
              <a
                href="mailto:juhyuntae@example.com"
                className="text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                연락하기
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8 mb-4">
              <div className="text-center md:text-left">
                <span className="font-semibold text-gray-900 dark:text-white">{postCount}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">게시물</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold text-gray-900 dark:text-white">{collectionCount}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">컬렉션</span>
              </div>
            </div>

            {/* Bio */}
            <div className="text-sm text-gray-900 dark:text-white">
              <p className="font-semibold">주현태 / Juhyuntae Joo</p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                패션 디자이너 · 소재와 구조로 이야기를 짓는 사람
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                📍 Seoul, Korea
              </p>
              <p className="mt-1">
                <a
                  href="https://instagram.com/juhyuntae_design"
                  className="text-blue-900 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @juhyuntae_design
                </a>
                {' · '}
                <a
                  href="mailto:juhyuntae@example.com"
                  className="text-blue-900 dark:text-blue-400 hover:underline"
                >
                  juhyuntae@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          initialCode={urlCode ?? undefined}
        />
      )}
    </>
  )
}
