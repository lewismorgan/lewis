import { ThemeToggle } from './theme-toggle'

import { render, screen } from '~/lib/test-utils'

describe('ThemeToggle Component', () => {
  it('renders theme toggle button', () => {
    render(<ThemeToggle />)
    // ThemeToggle renders a button with theme switcher functionality
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('has accessible interactive element', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })
})
