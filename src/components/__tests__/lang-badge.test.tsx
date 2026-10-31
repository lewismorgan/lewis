import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LANGUAGE_TINTS, LanguageBadges } from '~/components/lang-badge'
import { type ProgrammingLanguage } from '~/lib/types'

const ALL_LANGUAGES = Object.keys(LANGUAGE_TINTS) as ProgrammingLanguage[]

const badges = (): HTMLElement[] => screen.queryAllByTestId('lang-badge')

const tintOf = (badge: HTMLElement): { h: string; c: string } => ({
  h: badge.style.getPropertyValue('--lang-h'),
  c: badge.style.getPropertyValue('--lang-c'),
})

describe('LanguageBadges Component', () => {
  it('renders a badge for every provided language', () => {
    render(
      <LanguageBadges languages={['JavaScript', 'TypeScript', 'Python']} />,
    )

    expect(badges()).toHaveLength(3)
  })

  it('renders nothing when languages array is empty', () => {
    render(<LanguageBadges languages={[]} />)

    expect(badges()).toHaveLength(0)
  })

  it('renders each language name exactly once', () => {
    render(<LanguageBadges languages={['TypeScript']} />)

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(badges()[0]).toHaveTextContent(/^TypeScript$/)
  })

  it('renders languages in the given order, including duplicates', () => {
    render(
      <LanguageBadges languages={['JavaScript', 'TypeScript', 'JavaScript']} />,
    )

    expect(badges().map(badge => badge.textContent)).toEqual([
      'JavaScript',
      'TypeScript',
      'JavaScript',
    ])
  })

  it('has a tint for every supported language', () => {
    const expected: ProgrammingLanguage[] = [
      'JavaScript',
      'HTML',
      'CSS',
      'Python',
      'Java',
      'C++',
      'C#',
      'Ruby',
      'Swift',
      'TypeScript',
      'Rust',
      'Kotlin',
      'Shell',
      'Objective-C',
      'Visual Basic',
      'Makefile',
      'Unhandled',
    ]

    expect([...ALL_LANGUAGES].sort()).toEqual([...expected].sort())
  })

  it('sets the language hue on each badge', () => {
    render(<LanguageBadges languages={ALL_LANGUAGES} />)

    badges().forEach((badge, index) => {
      const language = ALL_LANGUAGES[index]!
      expect(tintOf(badge).h).toBe(String(LANGUAGE_TINTS[language].h))
    })
  })

  it('gives languages on the same spectrum distinct hues', () => {
    const hues = ALL_LANGUAGES.filter(lang => lang !== 'Unhandled').map(
      lang => LANGUAGE_TINTS[lang].h,
    )

    expect(new Set(hues).size).toBe(hues.length)
  })

  it('renders known languages at full chroma', () => {
    render(<LanguageBadges languages={['TypeScript']} />)

    expect(tintOf(badges()[0]!).c).toBe('1')
  })

  it('renders unhandled languages as a neutral pill', () => {
    render(<LanguageBadges languages={['Unhandled']} />)

    expect(tintOf(badges()[0]!).c).toBe('0')
  })

  it('hides the signal dot from assistive technology', () => {
    render(<LanguageBadges languages={['Rust']} />)

    const dot = badges()[0]!.querySelector('[aria-hidden="true"]')
    expect(dot).not.toBeNull()
    expect(dot).toBeEmptyDOMElement()
  })
})
