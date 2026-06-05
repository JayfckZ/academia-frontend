import type { Metadata } from 'next'
import { Roboto, Fira_Code } from 'next/font/google';
import './globals.css'

export const metadata: Metadata = {
  title: 'Academia CodeFit',
  description: 'A academia mais completa da cidade'
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const firaCode = Fira_Code({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-fira-code',
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} ${firaCode.variable} scroll-smooth `}>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}
