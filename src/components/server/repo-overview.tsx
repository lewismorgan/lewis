import { Suspense } from 'react'

import { GitCard, GitCardSkeleton } from '../server/git-card'

import 'server-only'
import { getRepoLanguages, getRepositories } from '~/server'

const RepositoryCards = async ({
  count,
  slowMode,
}: {
  count: number
  slowMode: boolean
}) => {
  const repositoryData = await getRepositories(slowMode)

  const repositories = repositoryData.filter(repo => !repo.fork).slice(0, count)

  // Fetch all languages upfront in parallel to reduce API calls
  const languagesPromises = repositories.map(async repo => {
    return await getRepoLanguages(repo.name, slowMode)
  })
  const allLanguages = await Promise.all(languagesPromises)

  return repositories.map((repo, index) => (
    <Suspense key={index} fallback={<GitCardSkeleton />}>
      <GitCard
        key={index}
        {...repo}
        languages={allLanguages[index] ?? []}
        slowMode={slowMode}
      />
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
    <div
      className="col-span-full my-auto flex w-full animate-pulse justify-center text-center align-middle font-mono font-light"
      data-testid="repos-loading-text"
    >
      Summoning my repositories from the GitHub universe...
    </div>
  )

  // Each card is wrapped in a suspense because each card fetches its own data
  return (
    <div
      className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3"
      data-testid="repo-grid"
    >
      <Suspense fallback={repoLoadText}>
        <RepositoryCards count={count} slowMode={slowMode} />
      </Suspense>
    </div>
  )
}
