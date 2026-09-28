import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  verifyAccessCode,
  recordCodeAccess,
} from '@/lib/access-code'
import { setSessionCode } from '@/lib/session'

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  )
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)

  const rateLimitCheck = await checkRateLimit(ip)
  if (rateLimitCheck.blocked) {
    return NextResponse.json(
      { error: `너무 많이 시도했습니다. ${rateLimitCheck.minutesLeft}분 후 다시 시도해주세요.` },
      { status: 429 }
    )
  }

  let code: string
  try {
    const body = await req.json()
    code = body.code
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: '코드를 입력해주세요.' }, { status: 400 })
  }

  const result = await verifyAccessCode(code)

  if (!result.valid) {
    await recordFailedAttempt(ip)
    return NextResponse.json({ error: result.error }, { status: 401 })
  }

  await clearFailedAttempts(ip)
  await recordCodeAccess(result.codeId!)
  await setSessionCode(result.codeId!)

  return NextResponse.json({
    success: true,
    allowedCollections: result.allowedCollections,
  })
}
