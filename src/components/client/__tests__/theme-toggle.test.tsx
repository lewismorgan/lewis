import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const setThemeMock = vi.fn()
let themeValue: string | undefined = 'dark'

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: themeValue,
    setTheme: setThemeMock,
  }),
}))

import { ThemeToggle } from '~/components/client/theme-toggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    setThemeMock.mockReset()
    themeValue = 'dark'
  })

  it('renders the toggle button after mount', async () => {
    render(<ThemeToggle />)

    expect(
      await screen.findByRole('button', { name: 'Toggle Theme' }),
    ).toBeInTheDocument()
  })

  it('toggles from dark to light theme', async () => {
    render(<ThemeToggle />)

    const toggle = await screen.findByRole('button', { name: 'Toggle Theme' })
    await userEvent.click(toggle)

    expect(setThemeMock).toHaveBeenCalledWith('light')
  })

  it('toggles from light to dark theme', async () => {
    themeValue = 'light'
    render(<ThemeToggle />)

    const toggle = await screen.findByRole('button', { name: 'Toggle Theme' })
    await userEvent.click(toggle)

    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })
})
