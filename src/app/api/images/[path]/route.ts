import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getSessionCode } from '@/lib/session'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  const { path } = await params
  const decodedPath = decodeURIComponent(path)

  // Check if this is a restricted image
  const supabase = await createServiceClient()
  const { data: imageData } = await supabase
    .from('post_images')
    .select('post_id, posts!inner(is_restricted, collection_id)')
    .eq('storage_path', decodedPath)
    .single()

  const post = (imageData?.posts as unknown) as { is_restricted: boolean; collection_id: string } | null

  if (post?.is_restricted) {
    const codeId = await getSessionCode()
    if (!codeId) {
      return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
    }

    // Validate code is still active
    const { data: codeData } = await supabase
      .from('access_codes')
      .select('is_active, expires_at, allowed_collections')
      .eq('id', codeId)
      .single()

    if (!codeData?.is_active) {
      return NextResponse.json({ error: '코드가 비활성화되었습니다.' }, { status: 403 })
    }
    if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
      return NextResponse.json({ error: '코드가 만료되었습니다.' }, { status: 403 })
    }

    const allowedCollections: string[] = codeData.allowed_collections ?? []
    if (allowedCollections.length > 0 && post.collection_id) {
      if (!allowedCollections.includes(post.collection_id)) {
        return NextResponse.json({ error: '이 컬렉션에 대한 접근 권한이 없습니다.' }, { status: 403 })
      }
    }
  }

  // Generate a signed URL (5 minutes)
  const { data: signedData, error } = await supabase.storage
    .from('portfolio')
    .createSignedUrl(decodedPath, 300)

  if (error || !signedData?.signedUrl) {
    return NextResponse.json({ error: '이미지를 불러올 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.redirect(signedData.signedUrl)
}
