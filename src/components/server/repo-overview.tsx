import { Suspense } from 'react'

import { GitCard, GitCardSkeleton } from '../server/git-card'

import 'server-only'
import { getRepositories } from '~/server'

const RepositoryCards = async ({
  count,
  slowMode,
}: {
  count: number
  slowMode: boolean
}) => {
  const repositoryData = await getRepositories(slowMode)

  const repositories = repositoryData.filter(repo => !repo.fork).slice(0, count)

  return repositories.map((repo, index) => (
    <Suspense key={index} fallback={<GitCardSkeleton />}>
      <GitCard key={index} {...repo} slowMode={slowMode} />
    </Suspense>
  ))
}

export const RepositoryOverview = ({
  count,
  slowMode,
}: {
  count: number
  slowMode: boolean
}) => {
  console.log('RepositoryOverview slowMode:', slowMode)
  const repoLoadText = (
    <div className="my-auto flex animate-pulse text-center align-middle font-mono font-light">
      Summoning my repositories from the GitHub universe...
    </div>
  )

  // Each card is wrapped in a suspense because each card fetches its own data
  return (
    <div className="flex w-fit max-w-[950px] flex-row flex-wrap items-center justify-center gap-4 align-middle">
      <Suspense fallback={repoLoadText}>
        <RepositoryCards count={count} slowMode={slowMode} />
      </Suspense>
    </div>
  )
}
