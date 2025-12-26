import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TypingAnimation } from '~/components/client/typing-animation'

describe('TypingAnimation', () => {
  it('renders with muted style initially when reverse=false', () => {
    vi.useFakeTimers()
    const text = 'Hello_Internet'

    render(<TypingAnimation finalText={text} reverse={false} />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    // Initially, index = 0 so it should fade (muted)
    expect(heading).toHaveClass('text-muted-foreground')
    // And no text yet
    expect(heading).toHaveTextContent('')

    vi.useRealTimers()
  })

  it('types forward and invokes onCompleted once at the end', async () => {
    vi.useFakeTimers()
    const text = 'ABC'
    const onCompleted = vi.fn((reversed: boolean) => reversed)

    render(
      <TypingAnimation
        finalText={text}
        reverse={false}
        onCompleted={onCompleted}
      />,
    )

    const heading = screen.getByRole('heading', { level: 1 })

    // Step 1: index -> 1 => "A" and not muted anymore
    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })
    expect(heading).toHaveTextContent('A')
    expect(heading).not.toHaveClass('text-muted-foreground')

    // Step 2: index -> 2 => "AB"
    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })
    expect(heading).toHaveTextContent('AB')

    // Step 3: index -> 3 => "ABC" then completes and becomes muted again
    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })
    expect(heading).toHaveTextContent('ABC')
    expect(heading).toHaveClass('text-muted-foreground')

    // Completion callback called once with reversed=false
    expect(onCompleted).toHaveBeenCalledTimes(1)
    expect(onCompleted).toHaveBeenCalledWith(false)

    vi.useRealTimers()
  })

  it('types in reverse and invokes onCompleted with true', async () => {
    vi.useFakeTimers()
    const text = 'Hi'
    const onCompleted = vi.fn((reversed: boolean) => reversed)

    render(
      <TypingAnimation
        finalText={text}
        reverse={true}
        onCompleted={onCompleted}
      />,
    )

    const heading = screen.getByRole('heading', { level: 1 })

    // Initial state for reverse: index = len => "Hi" and muted (completed state)
    expect(heading).toHaveTextContent('Hi')
    expect(heading).toHaveClass('text-muted-foreground')

    // First tick: index -> len-1 => "H" and not muted
    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })
    expect(heading).toHaveTextContent('H')
    expect(heading).not.toHaveClass('text-muted-foreground')

    // Second tick: index -> 0 => "" and muted again, then complete
    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })
    expect(heading).toHaveTextContent('')
    expect(heading).toHaveClass('text-muted-foreground')

    expect(onCompleted).toHaveBeenCalledTimes(1)
    expect(onCompleted).toHaveBeenCalledWith(true)

    vi.useRealTimers()
  })
})
