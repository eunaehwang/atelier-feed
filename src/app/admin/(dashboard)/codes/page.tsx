import { createClient } from '@/lib/supabase/server'
import AccessCodeManager from '@/components/admin/AccessCodeManager'
import { AccessCode, Collection } from '@/types'

async function getCodes() {
  const supabase = await createClient()
  const { data: codes } = await supabase
    .from('access_codes')
    .select('*, log:code_access_logs(access_count, first_accessed_at, last_accessed_at)')
    .order('created_at', { ascending: false })

  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('order_index', { ascending: true })

  return {
    codes: (codes ?? []) as unknown as AccessCode[],
    collections: (collections ?? []) as Collection[],
  }
}

export default async function CodesPage() {
  const { codes, collections } = await getCodes()

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">열람 코드 관리</h1>
      <AccessCodeManager codes={codes} collections={collections} />
    </div>
  )
}
