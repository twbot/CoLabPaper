import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/utils/styleHelpers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CoLabPaper',
  description: 'An AI powered, online, collaborative LaTeX editor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={
        (cn("min-h-screen"), inter.className)
      }>{children}</body>
    </html>
  )
}
