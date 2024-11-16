import { Analytics } from '@vercel/analytics/react'
import { Exo_2, Source_Code_Pro } from 'next/font/google'

import '~/styles/globals.css'
import { ThemeToggle } from '~/components/client/theme-toggle'
import { ExternalLink } from '~/components/links'
import { ThemeProvider } from '~/components/utils/theme-provider'

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

// TODO: Title should update if glowsticks, spacelizards

export const metadata = {
  title: 'Lewis Morgan',
  description: 'Personal website for Lewis Morgan',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // hydration warning suppression is only 1 level deep per react docs, this is to prevent the theme being put in html class errors
  // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
  return (
    <html
      lang="en"
      className={`${source_code_pro.variable} ${exo_2.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen min-w-full flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="fixed bottom-20 right-2 h-fit w-fit md:right-10 md:top-10">
            <ThemeToggle />
          </div>
          <div className="mb-5 grow">{children}</div>
          <footer className="fixed bottom-0 flex w-full justify-center text-xs text-muted-foreground">
            <div className="rounded-tl-sm rounded-tr-sm border-l border-r border-t border-border p-1 align-middle backdrop-blur-sm">
              Created by Lewis Morgan. Source code is available on{' '}
              <ExternalLink href="https://github.com/lewismorgan/lewis">
                GitHub
              </ExternalLink>
              .
            </div>
          </footer>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
