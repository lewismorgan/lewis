import { getRepos, getUser } from '~/server/git'

export type SimpleGitUser = {
  avatarUrl: string
  name: string
  url: string
  username: string
  bio: string
  repositories: number
  privateRepositories: number
}

type RepositoryData = {
  name: string
  fork: boolean
  url: string
  description: string
  languages_url: string
}

export async function getRepositories(): Promise<RepositoryData[]> {
  const repositories = await getRepos()

  return repositories.map(repo => {
    return {
      name: repo.name,
      fork: repo.fork,
      url: repo.html_url,
      description: repo.description ?? '',
      languages_url: repo.languages_url,
    }
  })
}

export async function getLanguages(url: string): Promise<string[]> {
  const urlFetch = await fetch(url)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const languagesData = await urlFetch.json()

  if (languagesData) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.keys(languagesData)
  } else return []
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
