import {
  type GitCommit,
  type ProgrammingLanguage,
  type RepositoryData,
  type SimpleGitUser,
} from '../lib/types'
import { getRepoCommit, getRepos, getUser } from './octokit'

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

export async function getRepositories(): Promise<RepositoryData[]> {
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

export async function getLatestCommit(repository: string): Promise<GitCommit> {
  const data = await getRepoCommit({ repo: repository, count: 1 })

  if (data.length === 0 || !data[0]) {
    throw new Error('No commits found')
  }

  return data[0]
}

type LanguageData = {
  name: ProgrammingLanguage
}

// TODO: Refactor this to just return an array of ProgrammingLanguage
export async function getLanguages(url: string): Promise<LanguageData[]> {
  const urlFetch = await fetch(url)
  const languagesData = (await urlFetch.json()) as Record<string, number>

  // sort the languages by the most used
  const sorted = Object.entries(languagesData).sort((a, b) => b[1] - a[1])

  return sorted.map(([language]) => {
    const lang = (language as ProgrammingLanguage) ?? 'Unhandled'
    if (lang === 'Unhandled') {
      console.warn(`Unhandled language: ${language}`)
      return {
        name: 'Unhandled',
      }
    }
    return {
      name: lang,
    }
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
