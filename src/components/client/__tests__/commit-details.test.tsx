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

  it('renders message and formatted relative time with truncated sha', () => {
    render(<GitCardCommit {...baseProps} />)

    expect(screen.getByText(/Refactor auth flow/)).toBeInTheDocument()
    expect(screen.getByText('abcdef1 • 5 mins ago')).toBeInTheDocument()
  })

  it('passes the date to the formatter', () => {
    render(<GitCardCommit {...baseProps} />)

    expect(formatTimeRelativeToNow).toHaveBeenCalledWith(baseProps.date)
  })

  it('renders + icon for human authors', () => {
    render(<GitCardCommit {...baseProps} />)

    const plusIcon = screen.getByLabelText('Contributor: Lewis')
    expect(plusIcon).toBeInTheDocument()
  })

  it('renders multiple + icons for multiple human authors', () => {
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

    expect(screen.getByLabelText('Contributor: Lewis')).toBeInTheDocument()
    expect(screen.getByLabelText('Contributor: Alice')).toBeInTheDocument()
  })

  it('renders bot icon for bot authors without name', () => {
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
    // Bot name should NOT be displayed
    expect(screen.queryByText('dependabot')).not.toBeInTheDocument()
  })

  it('removes duplicate authors', () => {
    const duplicateAuthorProps = {
      ...baseProps,
      authors: [
        {
          username: 'Lewis',
          avatarUrl: 'https://github.com/Lewis.png',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
        {
          username: 'Lewis',
          avatarUrl: 'https://github.com/Lewis.png',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
        {
          username: 'Lewis',
          avatarUrl: 'https://github.com/Lewis.png',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
      ],
    }

    render(<GitCardCommit {...duplicateAuthorProps} />)

    // Should only have one + icon even though Lewis appears 3 times
    const plusIcons = screen.getAllByLabelText(/Contributor:/)
    expect(plusIcons).toHaveLength(1)
  })

  it('renders mixed bot and human authors correctly', () => {
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

    // Should have bot icon
    expect(screen.getByLabelText('Bot contributor')).toBeInTheDocument()
    // Should have + icon for human
    expect(screen.getByLabelText('Contributor: Lewis')).toBeInTheDocument()
    // Should NOT display usernames
    expect(screen.queryByText('Lewis')).not.toBeInTheDocument()
    expect(screen.queryByText('copilot')).not.toBeInTheDocument()
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
