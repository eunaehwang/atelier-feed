-- =========================================
-- Atelier Feed - Supabase Schema
-- Supabase SQL Editor에 붙여넣고 실행하세요
-- =========================================

-- 컬렉션
CREATE TABLE collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cover_image text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 게시물
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  collection_id uuid REFERENCES collections(id) ON DELETE SET NULL,
  tab_type text NOT NULL DEFAULT 'all' CHECK (tab_type IN ('all', 'process')),
  is_restricted boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 게시물 이미지 (여러 장)
CREATE TABLE post_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 열람 코드
CREATE TABLE access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  memo text,
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  allowed_collections uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 열람 기록
CREATE TABLE code_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid NOT NULL REFERENCES access_codes(id) ON DELETE CASCADE,
  first_accessed_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  access_count integer NOT NULL DEFAULT 1
);

-- 코드 오입력 차단
CREATE TABLE rate_limit_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text UNIQUE NOT NULL,
  attempt_count integer NOT NULL DEFAULT 0,
  blocked_until timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- =========================================
-- RLS (Row Level Security) 설정
-- =========================================

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- 공개 게시물: 누구나 읽기 가능
CREATE POLICY "public_read_collections" ON collections FOR SELECT USING (true);
CREATE POLICY "public_read_posts" ON posts FOR SELECT USING (true);
CREATE POLICY "public_read_post_images" ON post_images FOR SELECT USING (true);

-- 관리자만 수정 가능 (로그인한 사용자)
CREATE POLICY "admin_all_collections" ON collections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_posts" ON posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_post_images" ON post_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_access_codes" ON access_codes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_logs" ON code_access_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_rate_limit" ON rate_limit_attempts FOR ALL USING (auth.role() = 'authenticated');

-- 서비스 롤(서버 API)은 rate_limit과 logs에 접근 허용
CREATE POLICY "service_rate_limit" ON rate_limit_attempts FOR ALL USING (true);
CREATE POLICY "service_logs" ON code_access_logs FOR ALL USING (true);
CREATE POLICY "service_access_codes_read" ON access_codes FOR SELECT USING (true);

-- =========================================
-- Storage 버킷 생성 (SQL Editor에서 실행)
-- =========================================
-- 아래는 참고용입니다. Storage는 대시보드에서 직접 만드세요.
-- portfolio: 공개 버킷 (public)
-- portfolio-private: 비공개 버킷 (private)

-- =========================================
-- 샘플 데이터 (선택사항)
-- =========================================

INSERT INTO collections (name, order_index) VALUES
  ('2024 F/W Collection', 1),
  ('2024 S/S Collection', 2),
  ('작업 스케치', 3);
