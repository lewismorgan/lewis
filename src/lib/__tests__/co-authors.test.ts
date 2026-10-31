import { describe, expect, it } from 'vitest'

import { isBotName, parseCoAuthors } from '~/lib/co-authors'

const commit = (...trailers: string[]): string =>
  ['feat: something', '', 'Body text.', '', ...trailers].join('\n')

describe('parseCoAuthors', () => {
  it('returns an empty list when there are no trailers', () => {
    expect(parseCoAuthors('fix: typo')).toEqual([])
  })

  it('treats AI agent co-authors as bots without a GitHub username', () => {
    // GitHub squash merges normalize "Co-Authored-By" to "Co-authored-by"
    for (const trailer of [
      'Co-authored-by: Claude Opus 5.5 <noreply@anthropic.com>',
      'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
    ]) {
      expect(parseCoAuthors(commit(trailer))).toEqual([
        {
          name: 'Claude Opus 5.5',
          username: undefined,
          email: 'noreply@anthropic.com',
          isBot: true,
        },
      ])
    }
  })

  it('derives the username from a GitHub noreply email', () => {
    expect(
      parseCoAuthors(
        commit(
          'Co-authored-by: Alice Smith <42+alice@users.noreply.github.com>',
        ),
      ),
    ).toEqual([
      {
        name: 'Alice Smith',
        username: 'alice',
        email: '42+alice@users.noreply.github.com',
        isBot: false,
      },
    ])
  })

  it('uses the name as username only when it is a valid GitHub login', () => {
    const [valid, invalid] = parseCoAuthors(
      commit(
        'Co-authored-by: octocat <octo@example.com>',
        'Co-authored-by: Jane Doe <jane@example.com>',
      ),
    )

    expect(valid).toMatchObject({ username: 'octocat', isBot: false })
    expect(invalid).toMatchObject({
      name: 'Jane Doe',
      username: undefined,
      isBot: false,
    })
  })

  it('flags [bot] names and known bot logins', () => {
    const authors = parseCoAuthors(
      commit(
        'Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>',
        'Co-authored-by: Copilot <198982749+Copilot@users.noreply.github.com>',
      ),
    )

    expect(authors.map(a => [a.name, a.isBot])).toEqual([
      ['dependabot', true],
      ['Copilot', true],
    ])
  })
})

describe('isBotName', () => {
  it('detects bots by tag or known name, case-insensitively', () => {
    expect(isBotName('renovate[bot]')).toBe(true)
    expect(isBotName('GitHub-Actions')).toBe(true)
    expect(isBotName('lewismorgan')).toBe(false)
  })
})
