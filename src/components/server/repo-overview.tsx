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
  const repoLoadText = (
    <div className="my-auto flex w-full animate-pulse text-center align-middle font-mono font-light">
      Summoning my repositories from the GitHub universe...
    </div>
  )

  // Each card is wrapped in a suspense because each card fetches its own data
  return (
    <div className="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 lg:gap-5 md:*:odd:last:col-span-2 lg:*:odd:last:col-span-2">
      <Suspense fallback={repoLoadText}>
        <RepositoryCards count={count} slowMode={slowMode} />
      </Suspense>
    </div>
  )
}
