import { beforeEach, describe, expect, it, vi } from 'vitest'

const { request } = vi.hoisted(() => ({ request: vi.fn() }))

vi.mock('@octokit/core', () => ({
  Octokit: class {
    request = request
  },
}))

import { getRepoCommit } from '~/server/octokit'

const commitResponse = (message: string) => ({
  data: [
    {
      sha: 'e3c9d69aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      html_url: 'https://github.com/lewismorgan/lewis/commit/e3c9d69',
      author: { login: 'lewismorgan' },
      commit: {
        message,
        author: {
          name: 'lewis',
          email: '1057112+lewismorgan@users.noreply.github.com',
        },
        committer: { date: '2026-10-31T12:00:00Z' },
      },
    },
  ],
})

const mockGitHub = (message: string): void => {
  request.mockImplementation(
    async (route: string, params: Record<string, string>) => {
      if (route === 'GET /repos/{owner}/{repo}/commits') {
        return commitResponse(message)
      }
      if (route === 'GET /users/{username}') {
        return {
          data: {
            login: params.username,
            html_url: `https://github.com/${params.username}`,
          },
        }
      }
      throw new Error(`Unexpected route ${route}`)
    },
  )
}

const userLookups = (): string[] =>
  request.mock.calls
    .filter(([route]) => route === 'GET /users/{username}')
    .map(([, params]) => (params as { username: string }).username)

describe('getRepoCommit co-authors', () => {
  beforeEach(() => {
    request.mockReset()
  })

  // Regression: a squash-merged Claude Code commit rendered "+ Claude Opus 5.5"
  // linked to https://github.com/Claude Opus 5.5 after a failed user lookup.
  it('shows an AI agent co-author as a bot with no profile link or lookup', async () => {
    mockGitHub(
      'chore: setup (#119)\n\n- body\n\nCo-authored-by: Claude Opus 5.5 <noreply@anthropic.com>',
    )

    const [commit] = await getRepoCommit({ repo: 'lewis', count: 1 })

    expect(commit?.authors).toEqual([
      {
        username: 'lewismorgan',
        profileUrl: 'https://github.com/lewismorgan',
        isBot: false,
      },
      { username: 'Claude Opus 5.5', isBot: true },
    ])
    expect(userLookups()).toEqual(['lewismorgan'])
  })

  it('never builds a profile URL for a co-author without a GitHub login', async () => {
    mockGitHub('feat: pair work\n\nCo-authored-by: Jane Doe <jane@example.com>')

    const [commit] = await getRepoCommit({ repo: 'lewis', count: 1 })

    expect(commit?.authors[1]).toEqual({ username: 'Jane Doe', isBot: false })
    expect(userLookups()).toEqual(['lewismorgan'])
    for (const author of commit?.authors ?? []) {
      expect(author.profileUrl ?? '').not.toMatch(/\s/)
    }
  })

  it('resolves a human co-author from their GitHub noreply email', async () => {
    mockGitHub(
      'fix: thing\n\nCo-authored-by: Alice Smith <42+alice@users.noreply.github.com>',
    )

    const [commit] = await getRepoCommit({ repo: 'lewis', count: 1 })

    expect(commit?.authors[1]).toEqual({
      username: 'alice',
      profileUrl: 'https://github.com/alice',
      isBot: false,
    })
  })
})
