export interface Collection {
  id: string
  name: string
  cover_image: string | null
  order_index: number
  created_at: string
}

export interface Post {
  id: string
  title: string
  description: string | null
  collection_id: string | null
  tab_type: 'all' | 'process'
  is_restricted: boolean
  order_index: number
  created_at: string
  collection?: Collection
  images?: PostImage[]
}

export interface PostImage {
  id: string
  post_id: string
  storage_path: string
  order_index: number
}

export interface AccessCode {
  id: string
  code: string
  memo: string | null
  expires_at: string | null
  is_active: boolean
  allowed_collections: string[]
  created_at: string
}

export interface CodeAccessLog {
  id: string
  code_id: string
  first_accessed_at: string
  last_accessed_at: string
  access_count: number
}
