import { Suspense } from 'react'

import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'

import 'server-only'
import { formatTimeRelativeToNow } from '~/lib/utils'
import { getRepoCommit } from '~/server/git'

type Props = {
  name: string
  description: string
}

export const Commit = async ({ repo }: { repo: string }) => {
  // Because this is a seperate component, it will hydrate when the data is loaded
  // by using a suspense boundary
  const commitData = await getRepoCommit(repo)

  const { author, sha, message, date: unparsedDate } = commitData
  const date = Date.parse(unparsedDate)
  const formattedDate = formatTimeRelativeToNow(date)

  return (
    <>
      <div className="flex flex-row align-middle text-sm lg:text-sm">
        <span className="mr-1 font-semibold">{author}</span>
        <span className="truncate text-ellipsis text-nowrap hover:underline">
          {message}
        </span>
      </div>
      <span className="text-right align-text-bottom text-xs font-thin text-muted-foreground">
        {sha.slice(0, 7)} • {formattedDate}
      </span>
    </>
  )
}

export const GitCard = async ({ name, description }: Props) => {
  // const contributorData = await getContributors(name)
  // const commits = contributorData.reduce((acc, contributor) => {
  //   return acc + contributor.contributions
  // }, 0)

  const languages: string[] = []

  // TODO: Get the language data from the repository
  // TODO: Change into badge component
  const langComponents = languages.map((language, index) => (
    <div key={language} className="text-xs text-muted-foreground md:text-sm">
      <span key={language}>{language}</span>
      {index < languages.length - 1 && (
        <span key={`${language}-separator`} className="text-card-foreground">
          {' · '}
        </span>
      )}
    </div>
  ))

  return (
    <Card className="w-fit max-w-80 p-1">
      <CardTitle className="p-1 font-mono font-thin tracking-tighter">
        {name}
      </CardTitle>
      <CardDescription className="w-full p-1 text-left align-middle">
        {description}
      </CardDescription>
      <CardContent className="flex w-full flex-col p-0">
        <div className="flex w-full flex-row justify-center gap-1">
          {langComponents}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex w-full flex-col p-1">
            <Commit repo={name} />
          </div>
        </Suspense>
      </CardContent>
    </Card>
  )
}
