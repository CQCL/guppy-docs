import './globals.css'
import '@quantinuum/quantinuum-ui/tokens.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const jetBrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Guppy',
  description: 'Quantum-first programming language, embedded in Python.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github.min.css"
        ></link>
        <link rel="icon" type="image/svg+xml" href="quantinuum_favicon.svg" />
      </head>
      <body
        className={`${inter.variable} text-base  overflow-x-hidden font-sans antialiased ${jetBrains.variable} `}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-YPQ1FTGDL3" />
    </html>
  )
}
