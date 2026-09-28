import { createServiceClient } from './supabase/server'

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MINUTES = 15

function hashIp(ip: string): string {
  // Simple hash for privacy - not cryptographic
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    hash = ((hash << 5) - hash) + ip.charCodeAt(i)
    hash |= 0
  }
  return hash.toString(36)
}

export async function checkRateLimit(ip: string): Promise<{ blocked: boolean; minutesLeft?: number }> {
  const supabase = await createServiceClient()
  const ipHash = hashIp(ip)

  const { data } = await supabase
    .from('rate_limit_attempts')
    .select('attempt_count, blocked_until')
    .eq('ip_hash', ipHash)
    .single()

  if (!data) return { blocked: false }

  if (data.blocked_until) {
    const blockedUntil = new Date(data.blocked_until)
    const now = new Date()
    if (blockedUntil > now) {
      const minutesLeft = Math.ceil((blockedUntil.getTime() - now.getTime()) / 60000)
      return { blocked: true, minutesLeft }
    }
  }

  return { blocked: false }
}

export async function recordFailedAttempt(ip: string) {
  const supabase = await createServiceClient()
  const ipHash = hashIp(ip)

  const { data } = await supabase
    .from('rate_limit_attempts')
    .select('id, attempt_count')
    .eq('ip_hash', ipHash)
    .single()

  const newCount = (data?.attempt_count ?? 0) + 1
  const blockedUntil = newCount >= RATE_LIMIT_MAX
    ? new Date(Date.now() + RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()
    : null

  if (data?.id) {
    await supabase
      .from('rate_limit_attempts')
      .update({ attempt_count: newCount, blocked_until: blockedUntil })
      .eq('id', data.id)
  } else {
    await supabase
      .from('rate_limit_attempts')
      .insert({ ip_hash: ipHash, attempt_count: newCount, blocked_until: blockedUntil })
  }
}

export async function clearFailedAttempts(ip: string) {
  const supabase = await createServiceClient()
  const ipHash = hashIp(ip)
  await supabase.from('rate_limit_attempts').delete().eq('ip_hash', ipHash)
}

export async function verifyAccessCode(code: string): Promise<{
  valid: boolean
  codeId?: string
  allowedCollections?: string[]
  error?: string
}> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from('access_codes')
    .select('id, is_active, expires_at, allowed_collections')
    .eq('code', code.toUpperCase().trim())
    .single()

  if (error || !data) return { valid: false, error: '유효하지 않은 코드입니다.' }
  if (!data.is_active) return { valid: false, error: '비활성화된 코드입니다.' }
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: '만료된 코드입니다.' }
  }

  return {
    valid: true,
    codeId: data.id,
    allowedCollections: data.allowed_collections ?? [],
  }
}

export async function recordCodeAccess(codeId: string) {
  const supabase = await createServiceClient()
  const now = new Date().toISOString()

  const { data } = await supabase
    .from('code_access_logs')
    .select('id, access_count')
    .eq('code_id', codeId)
    .single()

  if (data?.id) {
    await supabase
      .from('code_access_logs')
      .update({ last_accessed_at: now, access_count: data.access_count + 1 })
      .eq('id', data.id)
  } else {
    await supabase
      .from('code_access_logs')
      .insert({ code_id: codeId, first_accessed_at: now, last_accessed_at: now, access_count: 1 })
  }
}
