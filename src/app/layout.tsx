import { Exo_2, Source_Code_Pro } from 'next/font/google'

import '~/styles/globals.css'
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

// TODO: Add a dark mode toggle button

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${source_code_pro.variable} ${exo_2.variable}`}>
      <body className="h-screen w-screen font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
