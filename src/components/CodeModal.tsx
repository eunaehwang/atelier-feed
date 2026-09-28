'use client'

import { useState, useRef, useEffect } from 'react'

interface CodeModalProps {
  onClose: () => void
  onSuccess?: (allowedCollections: string[]) => void
  initialCode?: string
}

export default function CodeModal({ onClose, onSuccess, initialCode }: CodeModalProps) {
  const [code, setCode] = useState(initialCode?.toUpperCase() ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.(data.allowedCollections ?? [])
          onClose()
          window.location.reload()
        }, 1000)
      } else {
        setError(data.error ?? '코드 확인 중 오류가 발생했습니다.')
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            열람 코드 입력
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            발급받은 열람 코드를 입력하면 전용 게시물을 볼 수 있습니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="예: ATL-7K2M-QX9P"
              className="w-full px-4 py-3 text-sm font-mono border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-shadow"
              disabled={loading || success}
              autoComplete="off"
            />

            {error && (
              <p className="text-red-500 text-xs px-1">{error}</p>
            )}

            {success && (
              <p className="text-green-600 dark:text-green-400 text-xs px-1 flex items-center gap-1">
                <span>✓</span> 인증되었습니다. 잠시 후 새로고침됩니다.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || success || !code.trim()}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-80 disabled:opacity-40 transition-opacity"
            >
              {loading ? '확인 중...' : success ? '인증 완료' : '확인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
