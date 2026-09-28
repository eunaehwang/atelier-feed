'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AccessCode, Collection } from '@/types'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `ATL-${seg(4)}-${seg(4)}`
}

interface ExtendedCode extends AccessCode {
  log?: { access_count: number; first_accessed_at: string; last_accessed_at: string }[]
}

interface AccessCodeManagerProps {
  codes: ExtendedCode[]
  collections: Collection[]
}

export default function AccessCodeManager({ codes, collections }: AccessCodeManagerProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [newCode, setNewCode] = useState(generateCode())
  const [memo, setMemo] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [allowedCollections, setAllowedCollections] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!memo.trim()) return alert('메모를 입력해주세요. (예: OO기업 지원)')
    setSaving(true)
    const supabase = createClient()
    await supabase.from('access_codes').insert({
      code: newCode,
      memo,
      expires_at: expiresAt || null,
      is_active: true,
      allowed_collections: allowedCollections,
    })
    setSaving(false)
    setShowForm(false)
    setMemo('')
    setExpiresAt('')
    setAllowedCollections([])
    setNewCode(generateCode())
    router.refresh()
  }

  const toggleActive = async (code: AccessCode) => {
    const supabase = createClient()
    await supabase
      .from('access_codes')
      .update({ is_active: !code.is_active })
      .eq('id', code.id)
    router.refresh()
  }

  const handleDelete = async (code: AccessCode) => {
    if (!confirm(`코드 "${code.code}"를 삭제하시겠습니까?`)) return
    const supabase = createClient()
    await supabase.from('code_access_logs').delete().eq('code_id', code.id)
    await supabase.from('access_codes').delete().eq('id', code.id)
    router.refresh()
  }

  const toggleCollection = (id: string) => {
    setAllowedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const isExpired = (code: AccessCode) =>
    code.expires_at ? new Date(code.expires_at) < new Date() : false

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
      >
        + 새 코드 발급
      </button>

      {/* New code form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">새 열람 코드</h2>

          <div className="flex items-center gap-3">
            <div className="flex-1 font-mono text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
              {newCode}
            </div>
            <button
              onClick={() => setNewCode(generateCode())}
              className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              재생성
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">메모 * (예: OO기업 2025 상반기)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              placeholder="코드 발급 대상 메모"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">만료일 (선택)</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">허용 컬렉션 (비우면 전체 허용)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {collections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleCollection(c.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    allowedCollections.includes(c.id)
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {c.name}
                </button>
              ))}
              {collections.length === 0 && (
                <p className="text-xs text-gray-400">등록된 컬렉션이 없습니다</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-80 disabled:opacity-40 transition-opacity"
            >
              {saving ? '저장 중...' : '코드 발급'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Code list */}
      {codes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">발급된 코드가 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {codes.map((code) => {
            const log = code.log?.[0]
            const expired = isExpired(code)

            return (
              <div
                key={code.id}
                className={`bg-white dark:bg-gray-900 rounded-xl px-5 py-4 shadow-sm ${
                  !code.is_active || expired ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                        {code.code}
                      </span>
                      {!code.is_active && (
                        <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded">
                          비활성
                        </span>
                      )}
                      {expired && (
                        <span className="text-xs bg-gray-100 text-gray-500 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          만료됨
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">{code.memo}</p>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                      {code.expires_at && (
                        <span>만료: {new Date(code.expires_at).toLocaleDateString('ko-KR')}</span>
                      )}
                      {log ? (
                        <>
                          <span>열람 {log.access_count}회</span>
                          <span>최초: {new Date(log.first_accessed_at).toLocaleDateString('ko-KR')}</span>
                          <span>최근: {new Date(log.last_accessed_at).toLocaleDateString('ko-KR')}</span>
                        </>
                      ) : (
                        <span>아직 사용되지 않음</span>
                      )}
                    </div>

                    {code.allowed_collections && code.allowed_collections.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        허용 컬렉션: {code.allowed_collections.length}개
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(code)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        code.is_active
                          ? 'border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'border-green-200 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                    >
                      {code.is_active ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => handleDelete(code)}
                      className="text-xs text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
