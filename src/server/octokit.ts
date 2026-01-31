import { Octokit } from '@octokit/core'
import { type Endpoints } from '@octokit/types'

import {
  type GitAuthor,
  type GitCommit,
  type RepositoryData,
} from '~/lib/types'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

type User = {
  login: string
  id: number
  avatar_url: string
  url: string
  html_url: string
  repos_url: string
  type: string
  name: string | null
  blog: string | null
  location: string | null
  bio: string | null
  public_repos: number
  created_at: string
  updated_at: string
  total_private_repos: number | undefined
  owned_private_repos: number | undefined
}

export async function getUser(): Promise<User> {
  const { data } = await octokit.request('GET /user', {})
  const {
    login,
    id,
    avatar_url,
    html_url,
    url,
    repos_url,
    type,
    name,
    blog,
    location,
    bio,
    public_repos,
    created_at,
    updated_at,
    total_private_repos,
    owned_private_repos,
  } = data
  return {
    login,
    id,
    avatar_url,
    html_url,
    url,
    repos_url,
    type,
    name,
    blog,
    location,
    bio,
    public_repos,
    created_at,
    updated_at,
    total_private_repos,
    owned_private_repos,
  }
}

type listUserReposResponse = Endpoints['GET /user/repos']['response']
export async function getRepos(): Promise<RepositoryData[]> {
  const { data } = await octokit.request('GET /user/repos', {
    visibility: 'public',
    affiliation: 'owner',
    sort: 'pushed',
    per_page: 15,
  })

  return data.map((repo: listUserReposResponse['data'][0]) => {
    const {
      id,
      description,
      name,
      languages_url,
      commits_url,
      url,
      html_url,
      fork,
    } = repo
    return {
      id,
      description: description ?? '',
      name,
      languages_url,
      commits_url,
      url,
      html_url,
      fork,
    }
  })
}

/**
 * Parse co-authors from commit message trailers
 * GitHub adds co-authors in the format: "Co-authored-by: Name <email>"
 */
function parseCoAuthors(
  message: string,
): Array<{ name: string; email: string }> {
  const coAuthors: Array<{ name: string; email: string }> = []
  const lines = message.split('\n')

  for (const line of lines) {
    const match = /^Co-authored-by:\s*([^<]+)\s*<([^>]+)>/.exec(line)
    if (match) {
      coAuthors.push({
        name: match[1]?.trim() ?? '',
        email: match[2]?.trim() ?? '',
      })
    }
  }

  return coAuthors
}

/**
 * Determine if an author is a bot based on username or email patterns
 */
function isBot(username: string, email: string): boolean {
  const botPatterns = [
    'bot',
    'dependabot',
    'renovate',
    'snyk',
    'copilot',
    'github-actions',
    'greenkeeper',
  ]

  const lowerUsername = username.toLowerCase()
  const lowerEmail = email.toLowerCase()

  return botPatterns.some(
    pattern => lowerUsername.includes(pattern) || lowerEmail.includes(pattern),
  )
}

/**
 * Fetch author details from GitHub by email or use fallback data
 */
async function getAuthorDetails(
  name: string,
  email: string,
  username?: string,
): Promise<GitAuthor> {
  // Check if it's a bot first
  const bot = isBot(username ?? name, email)

  // If we have a username from the commit, try to get their profile
  if (username) {
    try {
      const { data } = await octokit.request('GET /users/{username}', {
        username,
      })
      return {
        username: data.login,
        avatarUrl: data.avatar_url,
        profileUrl: data.html_url,
        isBot: bot,
      }
    } catch (error) {
      // If user fetch fails, fall back to email-based approach
      console.warn(`Failed to fetch user ${username}, using fallback`, error)
    }
  }

  // Fallback: use name and default avatar
  return {
    username: username ?? name,
    avatarUrl: `https://github.com/${username ?? name}.png?size=40`,
    profileUrl: `https://github.com/${username ?? name}`,
    isBot: bot,
  }
}

type listGitCommitsResponse =
  Endpoints['GET /repos/{owner}/{repo}/commits']['response']
export async function getRepoCommit({
  repo,
  count,
}: {
  repo: string
  count: number
}): Promise<GitCommit[]> {
  const commits = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: 'lewismorgan',
    repo: repo,
    per_page: count,
  })

  const items = await Promise.all(
    commits.data.map(async (commit: listGitCommitsResponse['data'][0]) => {
      const { sha, commit: commitData, html_url, author: commitAuthor } = commit
      const { date } = commitData.committer!

      // Get primary author
      const primaryAuthorName = commitData.author?.name ?? 'Unknown'
      const primaryAuthorEmail = commitData.author?.email ?? ''
      const primaryAuthorUsername = commitAuthor?.login

      const primaryAuthor = await getAuthorDetails(
        primaryAuthorName,
        primaryAuthorEmail,
        primaryAuthorUsername,
      )

      // Parse co-authors from commit message
      const coAuthors = parseCoAuthors(commitData.message)
      const coAuthorDetails = await Promise.all(
        coAuthors.map(async coAuthor => {
          // Try to extract username from GitHub noreply email format
          // e.g., "username@users.noreply.github.com" or "123456+username@users.noreply.github.com"
          let username: string | undefined
          const noreplyMatch =
            /(?:\d+\+)?([^@]+)@users\.noreply\.github\.com/.exec(coAuthor.email)
          if (noreplyMatch) {
            username = noreplyMatch[1]
          }

          return getAuthorDetails(coAuthor.name, coAuthor.email, username)
        }),
      )

      // Combine primary author and co-authors
      const allAuthors = [primaryAuthor, ...coAuthorDetails]

      return {
        repo: repo,
        sha,
        date: date,
        authors: allAuthors,
        message: commitData.message,
        url: html_url,
      } as GitCommit
    }),
  )

  return items
}

type listContributors =
  Endpoints['GET /repos/{owner}/{repo}/contributors']['response']

export type GitContributor = {
  login: string
  id: number
  avatar_url: string
  html_url: string
  contributions: number
}

export async function getContributors(repo: string): Promise<GitContributor[]> {
  const contributors = await octokit.request(
    'GET /repos/{owner}/{repo}/contributors',
    {
      owner: 'lewismorgan',
      repo: repo,
    },
  )

  return contributors.data.map((contributor: listContributors['data'][0]) => {
    const { login, id, avatar_url, html_url, contributions } = contributor
    return {
      login: login ?? '',
      id: id ?? 0,
      avatar_url: avatar_url ?? '',
      html_url: html_url ?? '',
      contributions: contributions ?? 0,
    }
  })
}

export async function getReadme(repo: string): Promise<string | null> {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/readme', {
      owner: 'lewismorgan',
      repo: repo,
      mediaType: {
        format: 'raw',
      },
    })

    return response.data as unknown as string
  } catch (error) {
    console.error(`Failed to fetch README for ${repo}:`, error)
    return null
  }
}
