import { Hero } from './hero'

import { render, screen } from '~/lib/test-utils'

describe('Hero Component', () => {
  it('renders welcome message', () => {
    render(<Hero profileImage="/profile.jpg" name="Lewis Morgan" />)
    expect(
      screen.getByText(/Welcome to the digital space, domain, and realm of Lewis Morgan/),
    ).toBeInTheDocument()
  })

  it('renders with provided profile image', () => {
    render(<Hero profileImage="/test-profile.jpg" name="Test Name" />)
    // The avatar is rendered inside Spiel component
    expect(screen.getByAltText('Test Name')).toBeInTheDocument()
  })
})
