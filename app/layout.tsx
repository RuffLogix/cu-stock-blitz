import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'

const kanit = Kanit({ subsets: ['latin', 'thai'], weight: '300'})

export const metadata: Metadata = {
  title: 'CU-Stock Blitz | เว็บเทรดดี ๆ ที่ลงตัว',
  description: 'Created by RuffLogix with ❤️',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={kanit.className + ' ' + 'h-screen bg-gradient-to-b from-slate-900 to-slate-950'}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
