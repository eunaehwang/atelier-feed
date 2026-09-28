'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Post, Collection } from '@/types'

interface PostEditorProps {
  post?: Post
  collections: Collection[]
}

export default function PostEditor({ post, collections }: PostEditorProps) {
  const isEdit = !!post
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(post?.title ?? '')
  const [description, setDescription] = useState(post?.description ?? '')
  const [collectionId, setCollectionId] = useState(post?.collection_id ?? '')
  const [tabType, setTabType] = useState<'all' | 'process'>(post?.tab_type ?? 'all')
  const [isRestricted, setIsRestricted] = useState(post?.is_restricted ?? false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{ path: string; name: string }[]>(
    post?.images?.map((img) => ({ path: img.storage_path, name: img.storage_path.split('/').pop() ?? '' })) ?? []
  )

  const handleImageUpload = async (files: FileList) => {
    setUploading(true)
    const supabase = createClient()
    const newImages: { path: string; name: string }[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const bucket = isRestricted ? 'portfolio-private' : 'portfolio'

      const { error } = await supabase.storage.from(bucket).upload(path, file)
      if (!error) {
        newImages.push({ path, name: file.name })
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages])
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요.')
    setSaving(true)

    const supabase = createClient()

    if (isEdit && post) {
      const { error } = await supabase
        .from('posts')
        .update({
          title,
          description: description || null,
          collection_id: collectionId || null,
          tab_type: tabType,
          is_restricted: isRestricted,
        })
        .eq('id', post.id)

      if (!error) {
        await supabase.from('post_images').delete().eq('post_id', post.id)
        if (uploadedImages.length > 0) {
          await supabase.from('post_images').insert(
            uploadedImages.map((img, i) => ({
              post_id: post.id,
              storage_path: img.path,
              order_index: i,
            }))
          )
        }
      }
    } else {
      const { data: newPost, error } = await supabase
        .from('posts')
        .insert({
          title,
          description: description || null,
          collection_id: collectionId || null,
          tab_type: tabType,
          is_restricted: isRestricted,
          order_index: 999,
        })
        .select()
        .single()

      if (!error && newPost) {
        if (uploadedImages.length > 0) {
          await supabase.from('post_images').insert(
            uploadedImages.map((img, i) => ({
              post_id: newPost.id,
              storage_path: img.path,
              order_index: i,
            }))
          )
        }
      }
    }

    setSaving(false)
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Title */}
      <div>
        <label className="text-xs text-gray-500 font-medium">제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs text-gray-500 font-medium">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full mt-1 px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none"
        />
      </div>

      {/* Collection + Tab */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-medium">컬렉션</label>
          <select
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="w-full mt-1 px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
          >
            <option value="">없음</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium">탭 분류</label>
          <select
            value={tabType}
            onChange={(e) => setTabType(e.target.value as 'all' | 'process')}
            className="w-full mt-1 px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
          >
            <option value="all">전체</option>
            <option value="process">작업과정</option>
          </select>
        </div>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
        <input
          type="checkbox"
          id="restricted"
          checked={isRestricted}
          onChange={(e) => setIsRestricted(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="restricted" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <span className="font-medium">코드 소지자 전용</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">열람 코드 없이는 잠금 표시로 보임</span>
        </label>
      </div>

      {/* Images */}
      <div>
        <label className="text-xs text-gray-500 font-medium">이미지</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <p className="text-sm text-gray-500">클릭하여 이미지 추가</p>
          <p className="text-xs text-gray-400 mt-1">여러 장 선택 가능 · JPG, PNG, WEBP</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
        />

        {uploadedImages.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {uploadedImages.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                <img
                  src={`https://placehold.co/100x100/e8e0d8/8a7a6a?text=${i + 1}`}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <span className="absolute bottom-1 left-1 text-white text-xs bg-black/60 rounded px-1">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <p className="text-xs text-gray-400 mt-2">업로드 중...</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          {saving ? '저장 중...' : isEdit ? '수정 완료' : '게시물 등록'}
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="px-5 py-3 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  )
}
