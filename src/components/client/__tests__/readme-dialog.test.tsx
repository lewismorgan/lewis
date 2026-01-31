import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ReadmeDialog } from '~/components/client/readme-dialog'

// Mock fetch
global.fetch = vi.fn()

describe('ReadmeDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the button with FileText icon', () => {
    render(<ReadmeDialog repoName="test-repo" />)

    const button = screen.getByRole('button', {
      name: /View README for test-repo/i,
    })
    expect(button).toBeInTheDocument()
  })

  it('should open dialog when button is clicked', async () => {
    const user = userEvent.setup()
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: '# Test README' }),
    })

    render(<ReadmeDialog repoName="test-repo" />)

    const button = screen.getByRole('button', {
      name: /View README for test-repo/i,
    })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/test-repo \/ README\.md/i)).toBeInTheDocument()
    })
  })

  it('should fetch and display README content', async () => {
    const user = userEvent.setup()
    const mockReadme = '# Test README\n\nThis is a test README file.'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: mockReadme }),
    })

    render(<ReadmeDialog repoName="test-repo" />)

    const button = screen.getByRole('button', {
      name: /View README for test-repo/i,
    })
    await user.click(button)

    await waitFor(() => {
      const preElement = screen.getByText((content, element) => {
        return element?.tagName === 'PRE' && element.textContent === mockReadme
      })
      expect(preElement).toBeInTheDocument()
    })
  })

  it('should display loading state while fetching', async () => {
    const user = userEvent.setup()

    // Create a promise that never resolves during the test
    const mockPromise = new Promise<{
      ok: boolean
      json: () => Promise<{ content: string }>
    }>(() => {
      // Never resolves
    })
    ;(global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(mockPromise)

    render(<ReadmeDialog repoName="test-repo" />)

    const button = screen.getByRole('button', {
      name: /View README for test-repo/i,
    })
    await user.click(button)

    // Check for loading state immediately
    await waitFor(() => {
      expect(screen.getByText(/Loading README\.\.\./i)).toBeInTheDocument()
    })
  })

  it('should display custom message when README is not found (404)', async () => {
    const user = userEvent.setup()
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'README not found' }),
    })

    render(<ReadmeDialog repoName="test-repo" />)

    const button = screen.getByRole('button', {
      name: /View README for test-repo/i,
    })
    await user.click(button)

    await waitFor(() => {
      expect(
        screen.getByText(
          /It doesn't seem like this project has a README. I must really be slacking./i,
        ),
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/Failed to load README/i),
      ).not.toBeInTheDocument()
    })
  })

  it('should display error message when fetch fails with non-404 error', async () => {
    const user = userEvent.setup()
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    })

    render(<ReadmeDialog repoName="test-repo" />)

    const button = screen.getByRole('button', {
      name: /View README for test-repo/i,
    })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load README/i)).toBeInTheDocument()
      expect(screen.getByText(/Internal server error/i)).toBeInTheDocument()
    })
  })

  it('should not fetch README again if already loaded', async () => {
    const user = userEvent.setup()
    const mockReadme = '# Test README'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: mockReadme }),
    })

    render(<ReadmeDialog repoName="test-repo" />)

    const button = screen.getByRole('button', {
      name: /View README for test-repo/i,
    })

    // First click - should fetch
    await user.click(button)
    await waitFor(() => {
      expect(screen.getByText(mockReadme)).toBeInTheDocument()
    })

    // Close dialog
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    // Open again - should not fetch again
    await user.click(button)

    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup()
    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Network error'),
    )

    render(<ReadmeDialog repoName="test-repo" />)

    const button = screen.getByRole('button', {
      name: /View README for test-repo/i,
    })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load README/i)).toBeInTheDocument()
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })
})
