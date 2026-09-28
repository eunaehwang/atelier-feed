'use client'

import { useEffect } from 'react'

interface AboutModalProps {
  onClose: () => void
}

export default function AboutModal({ onClose }: AboutModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-950 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Profile image */}
        <div className="relative bg-gradient-to-b from-stone-100 to-stone-200 dark:from-gray-800 dark:to-gray-900 pt-10 pb-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg mb-4">
            <img
              src="https://placehold.co/144x144/e8e0d8/6b6b6b?text=JHT"
              alt="주현태"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">주현태</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Juhyuntae Joo</p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">✦</span>
            <p>소재와 구조로 이야기를 짓는 패션 디자이너입니다. 옷이 가진 형태와 감촉, 그 안에 담긴 서사를 중요하게 생각합니다.</p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">📍</span>
            <p>Seoul, Korea</p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">🎓</span>
            <p>패션디자인학과 졸업</p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-2">
            <a
              href="mailto:juhyuntae@example.com"
              className="flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              juhyuntae@example.com
            </a>
            <a
              href="https://instagram.com/juhyuntae_design"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:underline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @juhyuntae_design
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
