import { Octokit } from '@octokit/core'
import { type Endpoints } from '@octokit/types'

import { isBotName, parseCoAuthors } from '~/lib/co-authors'
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
    id: Number(id),
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
 * Fetch author details from GitHub by username
 */
async function getAuthorDetails(
  name: string,
  username?: string,
  isBotOverride?: boolean,
): Promise<GitAuthor> {
  const actualUsername = username ?? name
  const bot = isBotOverride ?? isBotName(actualUsername)

  // Clean up username (remove [bot] tag if present)
  const cleanUsername = actualUsername.replace('[bot]', '').trim()

  // If we have a username from the commit and they are not a bot, try to get their profile
  if (username && !bot) {
    try {
      const { data } = await octokit.request('GET /users/{username}', {
        username: cleanUsername,
      })

      return {
        username: data.login,
        profileUrl: data.html_url,
        isBot: false,
      }
    } catch (error) {
      // If user fetch fails, fall back to using the username directly
      console.warn(
        `Failed to fetch user ${cleanUsername}, using fallback`,
        error,
      )
    }
  }

  // Fallback: use name directly
  return {
    username: cleanUsername,
    profileUrl: `https://github.com/${cleanUsername}`,
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
      const primaryAuthorUsername = commitAuthor?.login

      const primaryAuthor = await getAuthorDetails(
        primaryAuthorName,
        primaryAuthorUsername,
      )

      // Parse co-authors from commit message trailers
      const coAuthors = parseCoAuthors(commitData.message)
      const coAuthorDetails = await Promise.all(
        coAuthors.map(async (coAuthor): Promise<GitAuthor> => {
          // Bots render as a single icon; no profile lookup needed
          if (coAuthor.isBot) return { username: coAuthor.name, isBot: true }
          // No resolvable GitHub login (e.g. "Jane Doe <jane@example.com>"): show the name unlinked
          if (!coAuthor.username) {
            return { username: coAuthor.name, isBot: false }
          }
          return getAuthorDetails(coAuthor.name, coAuthor.username, false)
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

export async function getLanguages(
  repo: string,
): Promise<Record<string, number>> {
  const { data } = await octokit.request(
    'GET /repos/{owner}/{repo}/languages',
    {
      owner: 'lewismorgan',
      repo: repo,
    },
  )

  return data
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
