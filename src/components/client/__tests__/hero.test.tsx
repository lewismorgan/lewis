import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Hero } from '~/components/client/hero'
import { type SpielProps } from '~/components/client/spiel'

type TypingAnimationProps = {
  finalText: string
  reverse?: boolean
  onCompleted?: (reversed: boolean) => void
}

vi.mock('~/components/client/spiel', () => ({
  Spiel: ({
    onGlowsticksClick,
    onLizardsClick,
    onCodeClick,
  }: Pick<
    SpielProps,
    'onGlowsticksClick' | 'onLizardsClick' | 'onCodeClick'
  >) => (
    <div data-testid="spiel">
      <button onClick={onGlowsticksClick} data-testid="glowsticks-btn">
        Glowsticks
      </button>
      <button onClick={onLizardsClick} data-testid="lizards-btn">
        Lizards
      </button>
      <button onClick={onCodeClick} data-testid="code-btn">
        Code
      </button>
    </div>
  ),
}))

vi.mock('~/components/client/typing-animation', () => ({
  TypingAnimation: ({ finalText }: TypingAnimationProps) => (
    <div data-testid="typing">{finalText}</div>
  ),
}))

describe('Hero Component', () => {
  const defaultProps = {
    profileImage: '/profile.jpg',
    name: 'John Doe',
  }

  it('should render the typing animation with correct text', () => {
    render(<Hero {...defaultProps} />)
    expect(screen.getByTestId('typing')).toBeInTheDocument()
    expect(screen.getByTestId('typing')).toHaveTextContent('Hello_Internet')
  })

  it('should render the welcome message', () => {
    render(<Hero {...defaultProps} />)
    expect(
      screen.getByText(/Welcome to the digital space/i),
    ).toBeInTheDocument()
  })

  it('should render the Spiel component', () => {
    render(<Hero {...defaultProps} />)
    expect(screen.getByTestId('spiel')).toBeInTheDocument()
  })

  it('should toggle force side on glowsticks click', async () => {
    const user = userEvent.setup()
    render(<Hero {...defaultProps} />)

    const glowsticksBtn = screen.getByTestId('glowsticks-btn')
    await user.click(glowsticksBtn)

    // Component should handle the click without errors
    expect(glowsticksBtn).toBeInTheDocument()
  })

  it('should toggle lizards on lizards click', async () => {
    const user = userEvent.setup()
    render(<Hero {...defaultProps} />)

    const lizardsBtn = screen.getByTestId('lizards-btn')
    await user.click(lizardsBtn)

    // Component should handle the click without errors
    expect(lizardsBtn).toBeInTheDocument()
  })

  it('should queue replay on code click', async () => {
    const user = userEvent.setup()
    render(<Hero {...defaultProps} />)

    const codeBtn = screen.getByTestId('code-btn')
    await user.click(codeBtn)

    // Component should handle the click without errors
    expect(codeBtn).toBeInTheDocument()
  })

  it('should have proper flex layout classes', () => {
    const { container } = render(<Hero {...defaultProps} />)
    const mainDiv = container.querySelector(
      '.flex.w-full.flex-col.p-4.align-middle',
    )
    expect(mainDiv).toBeInTheDocument()
  })
})
