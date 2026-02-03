import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ExternalLink } from '~/components/links'

describe('ExternalLink Component', () => {
  it('renders a link element', () => {
    render(<ExternalLink href="https://example.com">Click here</ExternalLink>)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
  })

  it('renders with correct href attribute', () => {
    const href = 'https://github.com/lewismorgan'
    render(<ExternalLink href={href}>GitHub</ExternalLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', href)
  })

  it('opens link in new tab with target="_blank"', () => {
    render(<ExternalLink href="https://example.com">Link</ExternalLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders children as link text', () => {
    render(<ExternalLink href="https://example.com">Click here</ExternalLink>)

    expect(screen.getByText('Click here')).toBeInTheDocument()
  })

  it('applies hover underline styling classes', () => {
    render(<ExternalLink href="https://example.com">Link</ExternalLink>)

    const link = screen.getByRole('link')
    expect(link.className).toContain('hover:underline')
    expect(link.className).toContain('hover:underline-offset-4')
  })

  it('renders with different URLs', () => {
    const { rerender } = render(
      <ExternalLink href="https://example.com">Link 1</ExternalLink>,
    )

    let link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')

    rerender(<ExternalLink href="https://different.com">Link 2</ExternalLink>)

    link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://different.com')
    expect(link).toHaveTextContent('Link 2')
  })

  it('renders with JSX children', () => {
    render(
      <ExternalLink href="https://example.com">
        <strong>Bold Link</strong>
      </ExternalLink>,
    )

    expect(screen.getByText('Bold Link')).toBeInTheDocument()
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('renders with multiple child nodes', () => {
    render(
      <ExternalLink href="https://example.com">
        Click <em>here</em> now
      </ExternalLink>,
    )

    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('Click here now')
    expect(link.querySelector('em')).toBeInTheDocument()
  })

  it('renders with empty children', () => {
    const { container } = render(<ExternalLink href="https://example.com" />)

    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link?.textContent).toBe('')
  })

  it('handles URLs with special characters', () => {
    const href = 'https://example.com?param=value&other=test#section'
    render(<ExternalLink href={href}>Link</ExternalLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', href)
  })

  it('handles relative URLs', () => {
    render(<ExternalLink href="/about">About</ExternalLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/about')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('maintains semantic link structure', () => {
    const { container } = render(
      <ExternalLink href="https://example.com">Link text</ExternalLink>,
    )

    const link = container.querySelector('a[href]')
    expect(link).toBeInTheDocument()
    expect(link?.tagName).toBe('A')
  })
})
