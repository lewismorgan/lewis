import { type CSSProperties } from 'react'

import { Badge } from './ui/badge'

import { type ProgrammingLanguage } from '~/lib/types'

type LanguageTint = {
  /** OKLCH hue (0-360) for the language's spot on the spectrum */
  h: number
  /** Chroma multiplier; 0 renders a neutral grey pill */
  c?: number
}

/**
 * Each language owns a single hue. Lightness and chroma come from the theme
 * tokens in globals.css, so every pill has the same weight and contrast in
 * both light and dark mode.
 */
export const LANGUAGE_TINTS: Record<ProgrammingLanguage, LanguageTint> = {
  'C++': { h: 0 },
  Ruby: { h: 22 },
  HTML: { h: 38 },
  Rust: { h: 48 },
  Kotlin: { h: 60 },
  Swift: { h: 74 },
  Java: { h: 88 },
  JavaScript: { h: 102 },
  Makefile: { h: 128 },
  Shell: { h: 145 },
  'C#': { h: 170 },
  'Objective-C': { h: 205 },
  Python: { h: 228 },
  TypeScript: { h: 258 },
  'Visual Basic': { h: 280 },
  CSS: { h: 305 },
  Unhandled: { h: 0, c: 0 },
}

const tintStyle = (language: ProgrammingLanguage): CSSProperties => {
  const { h, c = 1 } = LANGUAGE_TINTS[language] ?? LANGUAGE_TINTS.Unhandled
  return { '--lang-h': h, '--lang-c': c } as CSSProperties
}

export const LanguageBadges = ({
  languages,
}: {
  languages: ProgrammingLanguage[]
}): React.JSX.Element => {
  return (
    <>
      {languages.map((language, index) => (
        <Badge
          key={`${language}-${index}`}
          variant="outline"
          className="lang-pill gap-1.5 font-mono text-[11px] font-medium tracking-tight hover:cursor-default"
          style={tintStyle(language)}
          data-testid="lang-badge"
        >
          <span className="lang-pill-dot" aria-hidden="true" />
          {language}
        </Badge>
      ))}
    </>
  )
}
