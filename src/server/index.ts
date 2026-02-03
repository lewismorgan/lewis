import {
  type GitCommit,
  type ProgrammingLanguage,
  type RepositoryData,
  type SimpleGitUser,
} from '../lib/types'
import { getRepoCommit, getRepos, getUser } from './octokit'

import { sleep } from '~/lib/utils'

// Cache for language data to avoid duplicate API requests
const languageCache = new Map<string, ProgrammingLanguage[]>()

// Track rate limit headers to respect GitHub API limits
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let rateLimitInfo: { limit: number; remaining: number; reset: number } = {
  limit: 5000,
  remaining: 5000,
  reset: 0,
}

/**
 * Update rate limit info from response headers
 * Follows GitHub's best practice of checking x-ratelimit-* headers
 * See: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
 */
function updateRateLimitInfo(headers: Headers): void {
  const limit = headers.get('x-ratelimit-limit')
  const remaining = headers.get('x-ratelimit-remaining')
  const reset = headers.get('x-ratelimit-reset')

  if (limit && remaining && reset) {
    rateLimitInfo = {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
    }
  }
}

/**
 * Get retry delay based on rate limit headers or exponential backoff
 * Follows GitHub's best practice for handling rate limit errors
 * See: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api#exceeding-the-rate-limit
 */
function getRetryDelay(headers?: Headers, attemptNumber = 0): number {
  // Check for explicit retry-after header (secondary rate limit)
  if (headers) {
    const retryAfter = headers.get('retry-after')
    if (retryAfter) {
      return parseInt(retryAfter, 10) * 1000
    }
  }

  // For primary rate limit, use x-ratelimit-reset header if available
  if (headers) {
    const remaining = headers.get('x-ratelimit-remaining')
    const reset = headers.get('x-ratelimit-reset')

    if (remaining === '0' && reset) {
      const resetTime = parseInt(reset, 10) * 1000
      const now = Date.now()
      return Math.max(resetTime - now, 0)
    }
  }

  // Otherwise, exponential backoff starting at 1s, max 60s
  const baseDelay = 1000
  const delay = Math.min(baseDelay * Math.pow(2, attemptNumber), 60000)
  return delay
}

/**
 * Fetch with retry logic and rate limit handling
 * Max 3 attempts with exponential backoff
 */
async function fetchWithRetry(url: string, maxAttempts = 3): Promise<Response> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(url)

      // Update rate limit info from response headers
      updateRateLimitInfo(response.headers)

      // Handle rate limit errors (429 or 403 with retry-after)
      if (response.status === 429 || response.status === 403) {
        if (attempt < maxAttempts - 1) {
          const delay = getRetryDelay(response.headers, attempt)
          const status = response.status
          console.warn(
            `Rate limited (${status}). Retrying after ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`,
          )
          await sleep(delay)
          continue
        }
      }

      return response
    } catch (error) {
      if (attempt < maxAttempts - 1) {
        const delay = getRetryDelay(undefined, attempt)
        const errorMsg =
          error instanceof Error ? error.message : 'Unknown error'
        console.warn(
          `Fetch failed: ${errorMsg}. Retrying after ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`,
        )
        await sleep(delay)
        continue
      }
      throw error
    }
  }

  throw new Error(`Failed to fetch after ${maxAttempts} attempts`)
}

const repoBlacklist = [
  'dotfiles',
  'dotfiles-old',
  'HTML-Basics',
  'ISM4300_TechProj3B',
  'ISM4300_TechProj3A',
  'ISM4300_TechProj2b',
  'ISM4300_TechProj2',
  'ISM4300_HelloWorld',
  'lewis-webapp',
].map(repo => repo.toLowerCase())

export async function getRepositories(
  slow: boolean,
): Promise<RepositoryData[]> {
  if (slow) await sleep(1000)

  const repositoryData = await getRepos()

  const repositories = repositoryData.filter(
    repo => !repoBlacklist.includes(repo.name.toLowerCase()),
  )
  return repositories.map(repo => {
    return {
      name: repo.name,
      fork: repo.fork,
      url: repo.html_url,
      description: repo.description ?? '',
      languages_url: repo.languages_url,
      html_url: repo.html_url,
    }
  })
}

export async function getLatestCommit(
  repository: string,
  slow: boolean,
): Promise<GitCommit | undefined> {
  const data = await getRepoCommit({ repo: repository, count: 1 })

  // The slow mode allows simulating a slow connection
  if (slow) await sleep(2000)

  if (data.length === 0 || !data[0]) {
    console.error('No commits found for', repository)
    return undefined
  }

  return data[0]
}

export async function getLanguages(
  url: string,
  slow: boolean,
): Promise<ProgrammingLanguage[]> {
  // Check cache first to avoid duplicate requests for the same repository
  const cachedResult = languageCache.get(url)
  if (cachedResult) {
    return cachedResult
  }

  if (slow) await sleep(2000)

  const urlFetch = await fetchWithRetry(url)

  // Update rate limit tracking from response headers
  updateRateLimitInfo(urlFetch.headers)

  if (!urlFetch.ok) {
    console.error('Failed to fetch languages:', urlFetch.statusText)
    return []
  }

  const languagesData = (await urlFetch.json()) as Record<string, number>

  // sort the languages by the most used
  const sorted = Object.entries(languagesData).sort((a, b) => b[1] - a[1])

  const result = sorted.map(([language]) => {
    const lang = (language as ProgrammingLanguage) ?? 'Unhandled'
    if (lang === 'Unhandled') {
      console.warn(`Unhandled language: ${language}`)
    }
    return lang
  })

  // Store in cache for subsequent requests
  languageCache.set(url, result)

  return result
}

export async function getMyGit(): Promise<SimpleGitUser> {
  const data = await getUser()

  return {
    avatarUrl: data.avatar_url,
    name: data.name ?? '',
    url: data.html_url ?? '',
    username: data.login,
    bio: data.bio ?? '',
    repositories: data.public_repos,
    privateRepositories: data.total_private_repos ?? 0,
  }
}
