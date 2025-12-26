import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

// Each test customizes the next/navigation mock, so reset modules per test

describe('SlowModeContainer', () => {
  it('renders label and associates with the switch', async () => {
    vi.resetModules()
    vi.mock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams('slowmode=false'),
    }))

    const { SlowModeContainer } = await import('~/components/client/repo-container')

    render(
      <SlowModeContainer>
        <div data-testid="child" />
      </SlowModeContainer>,
    )

    // Label visible
    expect(screen.getByText(/Slow Mode/i)).toBeInTheDocument()

    // Switch is present and has accessible name from the label
    const switchEl = screen.getByRole('switch', { name: /Slow Mode/i })
    expect(switchEl).toBeInTheDocument()

    // Child content renders
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('defaults to checked when slowmode=true and toggles to false on click', async () => {
    vi.resetModules()
    vi.mock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams('slowmode=true'),
    }))

    const { SlowModeContainer } = await import('~/components/client/repo-container')

    const user = userEvent.setup()
    const pushSpy = vi.spyOn(window.history, 'pushState')
    const originalLocation = window.location
    const mockLocation = {
      ...originalLocation,
      reload: vi.fn(),
    } as unknown as Location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      configurable: true,
      writable: true,
    })

    render(<SlowModeContainer>{null}</SlowModeContainer>)

    const switchEl = screen.getByRole('switch', { name: /Slow Mode/i })

    await user.click(switchEl)

    // After toggle, pushState should include a slowmode query param
    const lastArg = pushSpy.mock.calls[pushSpy.mock.calls.length - 1]?.[2]
    expect(lastArg).toMatch(/^\?slowmode=(true|false)$/)
  })

  it('defaults to unchecked when slowmode=false and toggles to true on click', async () => {
    vi.resetModules()
    vi.mock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams('slowmode=false'),
    }))

    const { SlowModeContainer } = await import('~/components/client/repo-container')

    const user = userEvent.setup()
    const pushSpy = vi.spyOn(window.history, 'pushState')
    const originalLocation = window.location
    const mockLocation = {
      ...originalLocation,
      reload: vi.fn(),
    } as unknown as Location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      configurable: true,
      writable: true,
    })

    render(<SlowModeContainer>{null}</SlowModeContainer>)

    const switchEl = screen.getByRole('switch', { name: /Slow Mode/i })

    await user.click(switchEl)

    // Toggling from false -> true should push ?slowmode=true (use last call)
    const lastArg = pushSpy.mock.calls[pushSpy.mock.calls.length - 1]?.[2]
    expect(lastArg).toBe('?slowmode=true')
  })
})
