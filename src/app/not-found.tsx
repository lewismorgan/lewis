import type { Metadata } from 'next'

export const revalidate = 604800 // 7 days in seconds

export const metadata: Metadata = {
  title: '404 - Not Found',
  description: 'Page not found',
}

const starWarsQuotes = [
  "These are not the droids you're looking for.",
  'Lost a planet Master Obi-Wan has. How embarrassing.',
  'Perhaps the archives are incomplete.',
  'Failed, I have. Into exile, I must go.',
  "In my experience, there's no such thing as luck.",
  'I have a bad feeling about this.',
]

// Select quote at module evaluation time for ISR
const getRandomQuote = () =>
  starWarsQuotes[Math.floor(Math.random() * starWarsQuotes.length)]

const selectedQuote = getRandomQuote()

export default function NotFound() {
  return (
    <main className="mt-auto mb-auto flex h-full w-full flex-col items-center px-4 py-16 align-middle">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="text-6xl font-bold tracking-tight md:text-8xl">404</h1>
        <blockquote className="text-muted-foreground font-mono text-lg italic md:text-xl">
          &ldquo;{selectedQuote}&rdquo;
        </blockquote>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </main>
  )
}
