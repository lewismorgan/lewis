import { ExternalLink } from './links'

import { render, screen } from '~/lib/test-utils'

describe('ExternalLink Component', () => {
  it('renders link with correct href', () => {
    render(<ExternalLink href="https://github.com/lewismorgan">GitHub Profile</ExternalLink>)
    const link = screen.getByRole('link', { name: /GitHub Profile/ })
    expect(link).toHaveAttribute('href', 'https://github.com/lewismorgan')
  })

  it('opens in new tab', () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('has correct styling class', () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('hover:underline')
  })
})
