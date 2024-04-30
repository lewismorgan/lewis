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
}

export async function getRepositories(): Promise<RepositoryData[]> {
  const repositories = await getRepos()
  return repositories.map(repo => {
    return {
      name: repo.name,
      fork: repo.fork,
      url: repo.html_url,
      description: repo.description ?? '',
      languages: [],
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
