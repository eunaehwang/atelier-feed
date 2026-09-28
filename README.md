# atelier-feed

패션 디자이너 주현태의 포트폴리오 사이트 — 인스타그램 스타일 피드

## 기술 스택

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + Storage + Auth)
- **배포**: Vercel (GitHub push → 자동 배포)

## 로컬 개발

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase 키 입력

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

## 배포

`main` 브랜치에 push하면 Vercel에서 자동 배포됩니다.

## DB 초기화

`supabase/schema.sql` 파일을 Supabase SQL Editor에서 실행하세요.
