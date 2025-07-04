import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Baikal Proxy - Прокси для каждого',
  description: 'Безопасный и быстрый веб-прокси сервис для анонимного просмотра интернета',
  keywords: 'proxy, веб-прокси, анонимность, безопасность, интернет',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}