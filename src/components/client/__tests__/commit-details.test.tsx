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

  it('renders + character and human author name when multiple authors', () => {
    const multiAuthorProps = {
      ...baseProps,
      authors: [
        {
          username: 'Lewis',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
        {
          username: 'Alice',
          profileUrl: 'https://github.com/Alice',
          isBot: false,
        },
      ],
    }

    render(<GitCardCommit {...multiAuthorProps} />)

    expect(screen.getAllByText('+')).toHaveLength(2)
    expect(screen.getByText('Lewis')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('does not render + character when there is only one author', () => {
    render(<GitCardCommit {...baseProps} />)

    expect(screen.queryByText('+')).not.toBeInTheDocument()
    expect(screen.getByText('Lewis')).toBeInTheDocument()
  })

  it('renders bot icon for bot authors without name', () => {
    const botAuthorProps = {
      ...baseProps,
      authors: [
        {
          username: 'dependabot',
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

  it('renders only one bot icon even with multiple bots', () => {
    const multiBotsProps = {
      ...baseProps,
      authors: [
        {
          username: 'dependabot',
          profileUrl: 'https://github.com/dependabot',
          isBot: true,
        },
        {
          username: 'copilot',
          profileUrl: 'https://github.com/copilot',
          isBot: true,
        },
        {
          username: 'renovate',
          profileUrl: 'https://github.com/renovate',
          isBot: true,
        },
      ],
    }

    render(<GitCardCommit {...multiBotsProps} />)

    // Should only have one bot icon even though there are 3 bots
    const botIcons = screen.getAllByLabelText('Bot contributor')
    expect(botIcons).toHaveLength(1)
  })

  it('removes duplicate authors', () => {
    const duplicateAuthorProps = {
      ...baseProps,
      authors: [
        {
          username: 'Lewis',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
        {
          username: 'Lewis',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
        {
          username: 'Lewis',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
      ],
    }

    render(<GitCardCommit {...duplicateAuthorProps} />)

    // Should only have one name even though Lewis appears 3 times
    // And no + since it's only one unique author
    expect(screen.queryByText('+')).not.toBeInTheDocument()
    expect(screen.getByText('Lewis')).toBeInTheDocument()
  })

  it('renders mixed bot and human authors correctly', () => {
    const mixedAuthorProps = {
      ...baseProps,
      authors: [
        {
          username: 'Lewis',
          profileUrl: 'https://github.com/Lewis',
          isBot: false,
        },
        {
          username: 'copilot',
          profileUrl: 'https://github.com/copilot',
          isBot: true,
        },
      ],
    }

    render(<GitCardCommit {...mixedAuthorProps} />)

    // Should have one bot icon
    expect(screen.getByLabelText('Bot contributor')).toBeInTheDocument()
    // Should have + with human name (since there's a bot, show + even for one human)
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('Lewis')).toBeInTheDocument()
    // Should NOT display bot name
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
