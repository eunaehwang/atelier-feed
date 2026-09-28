import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '주현태 | Fashion Designer',
  description: '주현태 패션 디자이너 포트폴리오',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-white dark:bg-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
