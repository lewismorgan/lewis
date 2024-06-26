import { Octokit } from '@octokit/core'
import { type Endpoints } from '@octokit/types'

import { type GitCommit, type RepositoryData } from '~/lib/types'

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
    committer: 'lewismorgan',
    repo: repo,
    per_page: count,
  })

  const items = commits.data.map(
    (commit: listGitCommitsResponse['data'][0]) => {
      const { sha, commit: commitData, html_url } = commit
      const { date } = commitData.committer!

      return {
        repo: repo,
        sha,
        date: date,
        author: 'lewismorgan',
        message: commitData.message,
        url: html_url,
      } as GitCommit
    },
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
