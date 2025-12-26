import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GitCardCommit } from '~/components/client/commit-details'
import { formatTimeRelativeToNow } from '~/lib/utils'

vi.mock('~/lib/utils', () => ({
  formatTimeRelativeToNow: vi.fn(),
}))

describe('GitCardCommit', () => {
  const baseProps = {
    author: 'Lewis',
    sha: 'abcdef1234567890',
    message: 'Refactor auth flow',
    date: 1_700_000_000_000,
  }

  beforeEach(() => {
    vi.mocked(formatTimeRelativeToNow).mockReturnValue('5 mins ago')
  })

  it('renders author, message, and formatted relative time with truncated sha', () => {
    render(<GitCardCommit {...baseProps} />)

    expect(screen.getByText(baseProps.author)).toBeInTheDocument()
    expect(screen.getByText(baseProps.message)).toBeInTheDocument()
    expect(screen.getByText('abcdef1 • 5 mins ago')).toBeInTheDocument()
  })

  it('passes the date to the formatter', () => {
    render(<GitCardCommit {...baseProps} />)

    expect(formatTimeRelativeToNow).toHaveBeenCalledWith(baseProps.date)
  })
})
