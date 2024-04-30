import { getRepoCommit, getRepos, getUser } from '~/server/git'

export type SimpleGitUser = {
  avatarUrl: string
  name: string
  url: string
  username: string
  bio: string
  repositories: number
  privateRepositories: number
}

type CommitData = {
  author: string
  message: string
  // TODO: Change date to a number
  date: string
  sha: string
}

type Repository = {
  name: string
  fork: boolean
  url: string
  description: string
  languages: string[]
  commits: number | null
  commit: CommitData | null
}

export async function getRepositories(): Promise<Repository[]> {
  const repositories = await getRepos()
  return repositories.map(repo => {
    return {
      name: repo.name,
      fork: repo.fork,
      url: repo.html_url,
      description: repo.description ?? '',
      languages: [],
      commits: 0,
      commit: null,
    }
  })
}

export async function getRepositoryInformation(
  repo: Repository,
): Promise<Repository> {
  const commit = await getRepoCommit(repo.name)

  return {
    ...repo,
    commit: {
      author: commit.author,
      message: commit.message,
      date: commit.date,
      sha: commit.sha,
    },
  }
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
