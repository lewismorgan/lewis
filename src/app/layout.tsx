import { Analytics } from '@vercel/analytics/react'
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
  const commitSha = env.VERCEL_GIT_COMMIT_SHA

  // hydration warning suppression is only 1 level deep per react docs, this is to prevent the theme being put in html class errors
  // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
  return (
    <html
      lang="en"
      className={`${source_code_pro.variable} ${exo_2.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen min-w-full flex-col place-content-center place-items-center font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Footer commitSha={commitSha} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
