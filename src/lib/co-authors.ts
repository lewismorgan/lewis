export type CoAuthor = {
  /** Display name from the trailer, with any `[bot]` tag removed */
  name: string
  /** GitHub login, only when one can be reliably derived */
  username?: string
  email: string
  isBot: boolean
}

// GitHub logins: alphanumeric or single hyphens, can't start/end with a hyphen, max 39 chars
const GITHUB_LOGIN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
// e.g. "123456+username@users.noreply.github.com" or "username@users.noreply.github.com"
const GITHUB_NOREPLY = /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i
// Co-authored-by trailer; GitHub normalizes casing on squash merges, so match case-insensitively
const CO_AUTHOR_TRAILER = /^co-authored-by:\s*([^<]+?)\s*<([^>]+)>/i

// AI coding agents that co-sign commits with a non-GitHub identity
const AGENT_EMAILS = ['noreply@anthropic.com']

const BOT_NAMES = [
  'copilot',
  'dependabot',
  'renovate',
  'github-actions',
  'greenkeeper',
  'snyk-bot',
  'mergify',
]

/**
 * Determine if an author is a bot based on username.
 *
 * Note: We don't use GitHub noreply email patterns for bot detection because that format
 * (e.g., "123456+username@users.noreply.github.com") is used for both bots and humans when
 * PRs are squashed and merged. This would incorrectly flag human contributors as bots.
 */
export function isBotName(username: string): boolean {
  if (username.includes('[bot]')) return true
  const lower = username.toLowerCase()
  return BOT_NAMES.some(botName => lower.includes(botName))
}

/** Parse `Co-authored-by: Name <email>` trailers from a commit message. */
export function parseCoAuthors(message: string): CoAuthor[] {
  const coAuthors: CoAuthor[] = []

  for (const line of message.split('\n')) {
    const match = CO_AUTHOR_TRAILER.exec(line.trim())
    if (!match) continue

    const rawName = match[1]?.trim() ?? ''
    const email = match[2]?.trim() ?? ''
    const name = rawName.replace('[bot]', '').trim()

    const noreplyLogin = GITHUB_NOREPLY.exec(email)?.[1]
    const username =
      noreplyLogin ?? (GITHUB_LOGIN.test(name) ? name : undefined)

    const isBot =
      isBotName(rawName) ||
      (username !== undefined && isBotName(username)) ||
      AGENT_EMAILS.includes(email.toLowerCase())

    coAuthors.push({ name, username, email, isBot })
  }

  return coAuthors
}
