export type RepositoryData = {
  name: string
  fork: boolean
  url: string
  description: string
  languages_url: string
  html_url: string
}

export type SimpleGitUser = {
  avatarUrl: string
  name: string
  url: string
  username: string
  bio: string
  repositories: number
  privateRepositories: number
}

export type GitCommit = {
  repo: string
  sha: string
  date: string
  author: string
  message: string
  url: string
}

export type ProgrammingLanguage =
  | 'JavaScript'
  | 'HTML'
  | 'CSS'
  | 'Python'
  | 'Java'
  | 'C++'
  | 'C#'
  | 'Ruby'
  | 'Swift'
  | 'TypeScript'
  | 'Rust'
  | 'Kotlin'
  | 'Shell'
  | 'Objective-C'
  | 'Visual Basic'
  | 'Makefile'
  | 'Unhandled'
