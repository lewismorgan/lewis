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

export type GitAuthor = {
  username: string
  /** GitHub profile URL; absent when the author has no resolvable GitHub login */
  profileUrl?: string
  isBot: boolean
}

export type GitCommit = {
  repo: string
  sha: string
  date: string
  authors: GitAuthor[]
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
