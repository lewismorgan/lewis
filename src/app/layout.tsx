import { Analytics } from '@vercel/analytics/react'
import { type Metadata } from 'next'
import { Exo_2, Source_Code_Pro } from 'next/font/google'

import '~/styles/globals.css'
import { Footer } from '~/components/server/footer'
import { ThemeProvider } from '~/components/utils/theme-provider'
import { env } from '~/env'

const exo_2 = Exo_2({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-exo-2',
})

const source_code_pro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
})

export const metadata: Metadata = {
  title: {
    default: 'Lewis Morgan',
    template: '%s | Lewis Morgan',
  },
  description:
    'Software Engineer. Space enthusiast. Builder of things on the internet.',
  applicationName: 'lewismorgan.dev',
  keywords: [
    'Lewis Morgan',
    'Software Engineer',
    'Developer',
    'Portfolio',
    'GitHub',
  ],
  authors: [{ name: 'Lewis Morgan', url: 'https://lewismorgan.dev' }],
  creator: 'Lewis Morgan',
  publisher: 'Lewis Morgan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const commitSha = env.VERCEL_GIT_COMMIT_SHA

  // hydration warning suppression is only 1 level deep per react docs, this is to prevent the theme being put in html class errors
  // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
  return (
    <html
      lang="en"
      className={`${source_code_pro.variable} ${exo_2.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen min-w-full flex-col items-center justify-start font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Footer commitSha={commitSha} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
