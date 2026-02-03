import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ImageProfile } from '~/components/image-profile'

/* eslint-disable @next/next/no-img-element */
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string
    alt: string
    width: number
    height: number
    className?: string
  }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-testid="image-profile"
    />
  ),
}))
/* eslint-enable @next/next/no-img-element */

describe('ImageProfile Component', () => {
  const defaultProps = {
    avatarUrl: '/avatar.jpg',
    name: 'Lewis Morgan',
  }

  it('renders the image container', () => {
    const { container } = render(<ImageProfile {...defaultProps} />)

    const imageContainer = container.querySelector('div')
    expect(imageContainer).toBeInTheDocument()
  })

  it('renders the image with correct src and alt text', () => {
    render(<ImageProfile {...defaultProps} />)

    const image = screen.getByTestId('image-profile')
    expect(image).toHaveAttribute('src', defaultProps.avatarUrl)
    expect(image).toHaveAttribute('alt', defaultProps.name)
  })

  it('renders the image with correct width and height', () => {
    render(<ImageProfile {...defaultProps} />)

    const image = screen.getByTestId('image-profile')
    expect(image).toHaveAttribute('width', '296')
    expect(image).toHaveAttribute('height', '296')
  })

  it('applies the correct CSS classes for styling', () => {
    const { container } = render(<ImageProfile {...defaultProps} />)

    const imageContainer = container.querySelector('div')
    expect(imageContainer?.className).toContain('rounded-full')
    expect(imageContainer?.className).toContain('border-2')
    expect(imageContainer?.className).toContain('shadow-2xl')
    expect(imageContainer?.className).toContain('h-[128]')
    expect(imageContainer?.className).toContain('w-[128]')
  })

  it('applies responsive classes for larger screens', () => {
    const { container } = render(<ImageProfile {...defaultProps} />)

    const imageContainer = container.querySelector('div')
    expect(imageContainer?.className).toContain('lg:h-[296]')
    expect(imageContainer?.className).toContain('lg:w-[296]')
  })

  it('renders with different avatar URLs', () => {
    const props = {
      ...defaultProps,
      avatarUrl: '/different-avatar.png',
    }
    render(<ImageProfile {...props} />)

    const image = screen.getByTestId('image-profile')
    expect(image).toHaveAttribute('src', '/different-avatar.png')
  })

  it('renders with different names', () => {
    const props = {
      ...defaultProps,
      name: 'John Doe',
    }
    render(<ImageProfile {...props} />)

    const image = screen.getByTestId('image-profile')
    expect(image).toHaveAttribute('alt', 'John Doe')
  })

  it('has overflow-clip class for image containment', () => {
    const { container } = render(<ImageProfile {...defaultProps} />)

    const imageContainer = container.querySelector('div')
    expect(imageContainer?.className).toContain('overflow-clip')
  })

  it('has shrink class for responsive sizing', () => {
    const { container } = render(<ImageProfile {...defaultProps} />)

    const imageContainer = container.querySelector('div')
    expect(imageContainer?.className).toContain('shrink')
  })

  it('has block display class', () => {
    const { container } = render(<ImageProfile {...defaultProps} />)

    const imageContainer = container.querySelector('div')
    expect(imageContainer?.className).toContain('block')
  })
})
