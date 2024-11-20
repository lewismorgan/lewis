import {
  type GitCommit,
  type ProgrammingLanguage,
  type RepositoryData,
  type SimpleGitUser,
} from '../lib/types'
import { getRepoCommit, getRepos, getUser } from './octokit'

import { sleep } from '~/lib/utils'

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
  if (slow) await sleep(2000)
  const urlFetch = await fetch(url)

  if (!urlFetch.ok) {
    console.error('Failed to fetch languages:', urlFetch.statusText)
    return []
  }

  const languagesData = (await urlFetch.json()) as Record<string, number>

  // sort the languages by the most used
  const sorted = Object.entries(languagesData).sort((a, b) => b[1] - a[1])

  return sorted.map(([language]) => {
    const lang = (language as ProgrammingLanguage) ?? 'Unhandled'
    if (lang === 'Unhandled') {
      console.warn(`Unhandled language: ${language}`)
    }
    return lang
  })
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
