import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GitCardCommit } from '~/components/client/commit-details'
import type * as UtilsModule from '~/lib/utils'
import { formatTimeRelativeToNow } from '~/lib/utils'

vi.mock('~/lib/utils', async importOriginal => {
  const actual = await importOriginal<typeof UtilsModule>()
  return {
    ...actual,
    formatTimeRelativeToNow: vi.fn(),
  }
})

describe('GitCardCommit', () => {
  const baseProps = {
    authors: [
      {
        username: 'Lewis',
        avatarUrl: 'https://github.com/Lewis.png',
        profileUrl: 'https://github.com/Lewis',
        isBot: false,
      },
    ],
    sha: 'abcdef1234567890',
    message: 'Refactor auth flow',
    date: 1_700_000_000_000,
  }

  beforeEach(() => {
    vi.mocked(formatTimeRelativeToNow).mockReturnValue('5 mins ago')
  })

  it('renders author, message, and formatted relative time with truncated sha', () => {
    render(<GitCardCommit {...baseProps} />)

    expect(screen.getByText(baseProps.authors[0]!.username)).toBeInTheDocument()
    expect(screen.getByText(/Refactor auth flow/)).toBeInTheDocument()
    expect(screen.getByText('abcdef1 • 5 mins ago')).toBeInTheDocument()
  })

  it('passes the date to the formatter', () => {
    render(<GitCardCommit {...baseProps} />)

    expect(formatTimeRelativeToNow).toHaveBeenCalledWith(baseProps.date)
  })

  it('renders multiple authors with commas between them', () => {
    const multiAuthorProps = {
      ...baseProps,
      authors: [
        {
          username: 'Lewis',
          avatarUrl: 'https://github.com/Lewis.png',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
        {
          username: 'Alice',
          avatarUrl: 'https://github.com/Alice.png',
          profileUrl: 'https://github.com/Alice',
          isBot: false,
        },
      ],
    }

    render(<GitCardCommit {...multiAuthorProps} />)

    expect(screen.getByText('Lewis')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getAllByText(',')).toHaveLength(1)
  })

  it('renders bot icon for bot authors', () => {
    const botAuthorProps = {
      ...baseProps,
      authors: [
        {
          username: 'dependabot',
          avatarUrl: 'https://github.com/dependabot.png',
          profileUrl: 'https://github.com/dependabot',
          isBot: true,
        },
      ],
    }

    render(<GitCardCommit {...botAuthorProps} />)

    expect(screen.getByLabelText('Bot contributor')).toBeInTheDocument()
    expect(screen.getByText('dependabot')).toBeInTheDocument()
  })

  it('renders avatar for non-bot authors', () => {
    render(<GitCardCommit {...baseProps} />)

    // Check that we have an avatar container (not a bot icon)
    const avatarContainer = screen.getByText('LE')
    expect(avatarContainer).toBeInTheDocument()
    expect(screen.queryByLabelText('Bot contributor')).not.toBeInTheDocument()
  })

  it('renders mixed bot and human authors', () => {
    const mixedAuthorProps = {
      ...baseProps,
      authors: [
        {
          username: 'Lewis',
          avatarUrl: 'https://github.com/Lewis.png',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
        {
          username: 'copilot',
          avatarUrl: 'https://github.com/copilot.png',
          profileUrl: 'https://github.com/copilot',
          isBot: true,
        },
      ],
    }

    render(<GitCardCommit {...mixedAuthorProps} />)

    expect(screen.getByText('Lewis')).toBeInTheDocument()
    expect(screen.getByText('copilot')).toBeInTheDocument()
    expect(screen.getByLabelText('Bot contributor')).toBeInTheDocument()
    // Check for avatar fallback text
    expect(screen.getByText('LE')).toBeInTheDocument()
  })

  it('only shows first line of multi-line commit messages', () => {
    const multiLineProps = {
      ...baseProps,
      message: 'First line\nSecond line\nThird line',
    }

    render(<GitCardCommit {...multiLineProps} />)

    expect(screen.getByText(/First line/)).toBeInTheDocument()
    expect(screen.queryByText(/Second line/)).not.toBeInTheDocument()
  })
})
