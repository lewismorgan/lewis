import { Octokit } from '@octokit/core'

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
