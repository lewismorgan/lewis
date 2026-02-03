import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LanguageBadges } from '~/components/lang-badge'
import { type ProgrammingLanguage } from '~/lib/types'

vi.mock('~/components/ui/badge', () => ({
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <span data-testid="badge" className={className}>
      {children}
    </span>
  ),
}))

describe('LanguageBadges Component', () => {
  it('renders badges for all provided languages', () => {
    const languages: ProgrammingLanguage[] = [
      'JavaScript',
      'TypeScript',
      'Python',
    ]
    render(<LanguageBadges languages={languages} />)

    const badges = screen.getAllByTestId('badge')
    expect(badges).toHaveLength(3)
  })

  it('renders nothing when languages array is empty', () => {
    render(<LanguageBadges languages={[]} />)

    const badges = screen.queryAllByTestId('badge')
    expect(badges).toHaveLength(0)
  })

  it('renders correct text for JavaScript badge', () => {
    render(<LanguageBadges languages={['JavaScript']} />)

    expect(screen.getAllByText('JavaScript')).toHaveLength(2)
  })

  it('renders correct text for TypeScript badge', () => {
    render(<LanguageBadges languages={['TypeScript']} />)

    expect(screen.getAllByText('TypeScript')).toHaveLength(2)
  })

  it('renders correct text for Python badge', () => {
    render(<LanguageBadges languages={['Python']} />)

    expect(screen.getAllByText('Python')).toHaveLength(2)
  })

  it('applies correct color class for JavaScript', () => {
    render(<LanguageBadges languages={['JavaScript']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#F7DF1E]')
    expect(badge.className).toContain('hover:bg-[#D7DF1E]')
  })

  it('applies correct color class for TypeScript', () => {
    render(<LanguageBadges languages={['TypeScript']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#3178C6]')
    expect(badge.className).toContain('hover:bg-[#007ACC]')
  })

  it('applies correct color class for Python', () => {
    render(<LanguageBadges languages={['Python']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#3572A5]')
    expect(badge.className).toContain('hover:bg-[#0572A5]')
  })

  it('applies correct color class for Java', () => {
    render(<LanguageBadges languages={['Java']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#b07219]')
  })

  it('applies correct color class for CSS', () => {
    render(<LanguageBadges languages={['CSS']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#563d7c]')
  })

  it('applies correct color class for HTML', () => {
    render(<LanguageBadges languages={['HTML']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#e34c26]')
  })

  it('applies correct color class for Shell', () => {
    render(<LanguageBadges languages={['Shell']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#89e051]')
  })

  it('applies correct color class for C++', () => {
    render(<LanguageBadges languages={['C++']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#f34b7d]')
  })

  it('applies correct color class for Swift', () => {
    render(<LanguageBadges languages={['Swift']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#ffac45]')
  })

  it('applies correct color class for Ruby', () => {
    render(<LanguageBadges languages={['Ruby']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#701516]')
  })

  it('applies correct color class for Kotlin', () => {
    render(<LanguageBadges languages={['Kotlin']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#F18E33]')
  })

  it('applies correct color class for Makefile', () => {
    render(<LanguageBadges languages={['Makefile']} />)

    const badge = screen.getByTestId('badge')
    expect(badge.className).toContain('bg-[#427819]')
  })

  it('applies correct color class for Unhandled language', () => {
    render(<LanguageBadges languages={['Unhandled']} />)

    const badge = screen.getByTestId('badge')
    // Unhandled should have empty color string, so no bg-[...] color class
    expect(badge.className).not.toMatch(/bg-\[#\w+\]/)
  })

  it('applies shared badge styles to all badges', () => {
    render(<LanguageBadges languages={['JavaScript', 'TypeScript']} />)

    const badges = screen.getAllByTestId('badge')
    badges.forEach(badge => {
      expect(badge.className).toContain('text-white')
      expect(badge.className).toContain('hover:ring-background')
      expect(badge.className).toContain('hover:animate-pulse')
      expect(badge.className).toContain('hover:cursor-default')
      expect(badge.className).toContain('hover:ring-1')
      expect(badge.className).toContain('hover:ring-offset-2')
    })
  })

  it('renders multiple languages in correct order', () => {
    render(
      <LanguageBadges languages={['JavaScript', 'TypeScript', 'Python']} />,
    )

    const badges = screen.getAllByTestId('badge')
    expect(badges[0]).toHaveTextContent('JavaScript')
    expect(badges[1]).toHaveTextContent('TypeScript')
    expect(badges[2]).toHaveTextContent('Python')
  })

  it('renders duplicate languages correctly', () => {
    render(<LanguageBadges languages={['JavaScript', 'JavaScript']} />)

    const badges = screen.getAllByTestId('badge')
    expect(badges).toHaveLength(2)
    expect(badges[0]).toHaveTextContent('JavaScript')
    expect(badges[1]).toHaveTextContent('JavaScript')
  })
})
