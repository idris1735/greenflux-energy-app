import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar'
import ClientLayout from './client-layout'
import GraceChat from './components/GraceChat';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GreenFlux Energy',
  description: 'Sustainable Energy Solutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          <Navbar />
          {children}
          <GraceChat />

        </ClientLayout>
      </body>
    </html>
  )
}
