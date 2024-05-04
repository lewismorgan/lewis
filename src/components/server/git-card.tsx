import { Suspense } from 'react'

import { GitCardCommit } from '../client/commit-details'
import { LanguageBadges } from '../lang-badge'
import { ExternalLink } from '../links'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

import 'server-only'
import { getLanguages, getLatestCommit } from '~/server'

type Props = {
  name: string
  description: string
  html_url: string
  languages_url: string
}

export const Commit = async ({ repo }: { repo: string }) => {
  // Because this is a seperate component, it will hydrate when the data is loaded
  // by using a suspense boundary. Allows core repo details to show while waiting for
  // the commit data to load.
  const commitData = await getLatestCommit(repo)

  const { author, sha, message, date: unparsedDate } = commitData
  const date = Date.parse(unparsedDate)

  return (
    <GitCardCommit author={author} sha={sha} message={message} date={date} />
  )
}

export const GitCardSkeleton = () => {
  return <Skeleton className="h-24 w-64" />
}

export const GitCard = async ({
  name,
  description,
  languages_url,
  html_url,
}: Props) => {
  const languageData = await getLanguages(languages_url)
  const langBadges = (
    <LanguageBadges
      languages={languageData.slice(0, 3).map(lang => lang.name)}
    />
  )
  return (
    <Card className="h-fit w-fit max-w-80 p-1 shadow-md">
      <CardTitle className="p-1 font-mono font-thin tracking-tighter">
        <ExternalLink href={html_url}>{name}</ExternalLink>
      </CardTitle>
      <CardDescription className="w-full p-1 text-left align-middle">
        {description}
      </CardDescription>
      <CardContent className="flex w-full flex-col p-0">
        {languageData.length > 0 ? (
          <div className="flex w-full flex-row justify-center gap-2">
            {langBadges}
          </div>
        ) : undefined}
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex w-full flex-col p-1">
            <Commit repo={name} />
          </div>
        </Suspense>
      </CardContent>
    </Card>
  )
}
