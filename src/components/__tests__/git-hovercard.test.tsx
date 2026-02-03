import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LewisHovercard } from '~/components/git-hovercard'

/* eslint-disable @next/next/no-img-element */
vi.mock('~/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="avatar-image" />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}))
/* eslint-enable @next/next/no-img-element */

vi.mock('~/components/ui/hover-card', () => ({
  HoverCardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hover-card-content">{children}</div>
  ),
}))

describe('LewisHovercard Component', () => {
  const defaultProps = {
    url: 'https://github.com/lewismorgan',
    avatarUrl: '/avatar.jpg',
    username: 'lewismorgan',
    bio: 'Software Engineer',
    repositories: 42,
    privateRepositories: 5,
  }

  it('renders the hover card content', () => {
    render(<LewisHovercard {...defaultProps} />)

    const hoverCardContent = screen.getByTestId('hover-card-content')
    expect(hoverCardContent).toBeInTheDocument()
  })

  it('renders the avatar with correct image and username', () => {
    render(<LewisHovercard {...defaultProps} />)

    const avatarImage = screen.getByTestId('avatar-image')
    expect(avatarImage).toHaveAttribute('src', defaultProps.avatarUrl)
    expect(avatarImage).toHaveAttribute('alt', defaultProps.username)
  })

  it('renders the avatar fallback', () => {
    render(<LewisHovercard {...defaultProps} />)

    const avatarFallback = screen.getByTestId('avatar-fallback')
    expect(avatarFallback).toBeInTheDocument()
    expect(avatarFallback).toHaveTextContent('LM')
  })

  it('renders the username link with correct href', () => {
    render(<LewisHovercard {...defaultProps} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', defaultProps.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveTextContent(defaultProps.username)
  })

  it('renders the bio with first character lowercased', () => {
    render(<LewisHovercard {...defaultProps} />)

    expect(screen.getByText(/is a software engineer/i)).toBeInTheDocument()
  })

  it('correctly lowercases the first character of bio', () => {
    const props = { ...defaultProps, bio: 'Software Engineer' }
    render(<LewisHovercard {...props} />)

    expect(screen.getByText(/is a software engineer/i)).toBeInTheDocument()
  })

  it('renders public repositories count', () => {
    render(<LewisHovercard {...defaultProps} />)

    expect(
      screen.getByText(defaultProps.repositories.toString()),
    ).toBeInTheDocument()
    expect(screen.getByText('Public Repos')).toBeInTheDocument()
  })

  it('renders private repositories count', () => {
    render(<LewisHovercard {...defaultProps} />)

    expect(
      screen.getByText(defaultProps.privateRepositories.toString()),
    ).toBeInTheDocument()
    expect(screen.getByText('Private Repos')).toBeInTheDocument()
  })

  it('renders the separator character between repos', () => {
    render(<LewisHovercard {...defaultProps} />)

    const separators = screen.getAllByText('·')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('handles bio with single character correctly', () => {
    const props = { ...defaultProps, bio: 'X' }
    render(<LewisHovercard {...props} />)

    expect(screen.getByText(/is a x/i)).toBeInTheDocument()
  })

  it('renders with different numeric values', () => {
    const props = {
      ...defaultProps,
      repositories: 100,
      privateRepositories: 50,
    }
    render(<LewisHovercard {...props} />)

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })
})
