import { Suspense } from 'react'

import { GitCardCommit } from '../client/commit-details'
import { ReadmeDialog } from '../client/readme-dialog'
import { LanguageBadges } from '../lang-badge'
import { ExternalLink } from '../links'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

import 'server-only'
import type { ProgrammingLanguage } from '~/lib/types'
import { getLatestCommit } from '~/server'

type Props = {
  name: string
  description: string
  html_url: string
  languages: ProgrammingLanguage[]
  slowMode: boolean
}

export const Commit = async ({
  repo,
  slow,
}: {
  repo: string
  slow: boolean
}) => {
  // Because this is a seperate component, it will hydrate when the data is loaded
  // by using a suspense boundary. Allows core repo details to show while waiting for
  // the commit data to load.

  const commitData = await getLatestCommit(repo, slow)

  if (commitData === undefined) {
    return (
      <span className="text-muted-foreground m-auto text-sm font-thin">
        Unable to load latest commit data
      </span>
    )
  }

  const {
    authors,
    sha,
    message,
    date: unparsedDate,
    url: html_url,
  } = commitData
  const date = Date.parse(unparsedDate)

  return (
    <GitCardCommit
      url={html_url}
      authors={authors}
      sha={sha}
      message={message}
      date={date}
    />
  )
}

export const GitCardSkeleton = () => {
  return <Skeleton className="h-36 w-85 p-3 shadow-md md:w-93.75 lg:w-105" />
}

export const GitCard = async ({
  name,
  description,
  languages,
  html_url,
  slowMode,
}: Props) => {
  const langBadges = <LanguageBadges languages={languages.slice(0, 3)} />

  return (
    <Card
      className="max-h-80 w-85 p-3 shadow-md md:w-93.75 lg:w-105"
      data-testid={`git-card`}
    >
      <CardTitle
        className="flex items-center justify-between p-2 font-mono font-thin tracking-tighter"
        data-testid="git-repo-title"
      >
        <ExternalLink href={html_url}>{name}</ExternalLink>
        <ReadmeDialog repoName={name} />
      </CardTitle>
      <CardDescription className="w-full p-2 text-left align-middle leading-relaxed">
        {description}
      </CardDescription>
      <CardContent className="flex w-full flex-col p-0 pt-2">
        {languages.length > 0 ? (
          <div className="flex w-full flex-row justify-center gap-2 pb-2">
            {langBadges}
          </div>
        ) : undefined}
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex w-full flex-col p-2">
            <Commit repo={name} slow={slowMode} />
          </div>
        </Suspense>
      </CardContent>
    </Card>
  )
}
