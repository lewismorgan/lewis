import { Suspense } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from './ui/card'

import 'server-only'
import { getContributors, getRepoCommit } from '~/server/git'

type Props = {
  name: string
  description: string
}

export const Commit = async ({ repo }: { repo: string }) => {
  // Because this is a seperate component, it will hydrate when the data is loaded
  // by using a suspense boundary
  const commitData = await getRepoCommit(repo)

  const { author, sha, message } = commitData
  return (
    <div className="flex w-full flex-col p-1">
      <div className="flex flex-row justify-between align-middle text-xs lg:text-sm">
        <span className="mr-1 font-bold">{author}</span>
        <span className="w-56 truncate text-ellipsis text-nowrap hover:underline xl:w-64">
          {message}
        </span>
      </div>
      <span className="text-right align-text-bottom text-xs">
        {sha.slice(0, 7)}
      </span>
    </div>
  )
}

export const GitCard = async ({ name, description }: Props) => {
  const contributorData = await getContributors(name)
  const commits = contributorData.reduce((acc, contributor) => {
    return acc + contributor.contributions
  }, 0)

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

  // TODO: Determine a pre-defined width and height for the card to make some skeletons
  return (
    <Card className="w-fit p-1">
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
          <Commit repo={name} />
        </Suspense>
      </CardContent>
      <CardFooter className="block text-right text-sm text-muted-foreground">
        <span className="text-xs">{`${commits} commits are in this repository`}</span>
      </CardFooter>
    </Card>
  )
}
