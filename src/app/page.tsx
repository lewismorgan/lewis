import { Suspense } from 'react'

import { LewisHovercard } from '~/components/git-hovercard'
import { Hero } from '~/components/hero'
import { ImageProfile } from '~/components/image-profile'
import { GitCard, GitCardSkeleton } from '~/components/server/git-card'
import { HoverCard, HoverCardTrigger } from '~/components/ui/hover-card'
import { Separator } from '~/components/ui/separator'
import { AcademicCap, RocketLaunch } from '~/components/utils/icons'
import { getMyGit, getRepositories } from '~/lib/git'

const REPOSITORY_DISPLAY_COUNT = 5

const Bullets = () => {
  return (
    <div className="flex flex-col gap-1 tracking-tight md:text-lg">
      <div className="group flex w-full flex-row place-content-center items-center text-center align-middle hover:animate-pulse hover:cursor-default">
        <span className="mx-1 inline-flex items-baseline self-center align-bottom">
          <AcademicCap />
        </span>
        <span className="">Alumni of the University of South Florida</span>
      </div>
      <div className="group flex w-full flex-row place-content-center items-center text-center align-middle hover:animate-pulse hover:cursor-default">
        <span className="">
          Sending Humanity back to the{' '}
          <span className="tracking-wide">Moon</span>,{' '}
          <span className="tracking-wider">Mars</span>, and{' '}
          <span className="text-nowrap tracking-widest">
            Beyond{' '}
            <span className="inline-flex items-baseline self-center align-bottom">
              <RocketLaunch />
            </span>
          </span>
        </span>
      </div>
    </div>
  )
}
// TODO: Dark mode and light mode toggle

const RepositoryOverview = async ({ count }: { count: number }) => {
  const repositoryData = await getRepositories()

  const repositories = repositoryData.filter(repo => !repo.fork).slice(0, count)

  // Each card is wrapped in a suspense because each card fetches its own data
  return (
    <>
      {repositories.map((repo, index) => (
        <Suspense key={index} fallback={<GitCardSkeleton />}>
          <GitCard key={index} {...repo} />
        </Suspense>
      ))}
    </>
  )
}

const ContentSeperator = () => <Separator className="mx-auto my-5 w-[95%]" />

export default async function HomePage() {
  const git = await getMyGit()

  const repoLoadText = (
    <div className="my-auto flex animate-pulse text-center align-middle font-mono font-light">
      Summoning my repositories from the GitHub universe...
    </div>
  )

  return (
    <main className="flex w-full flex-col gap-1 px-1">
      <Hero />
      <div className="flex w-full flex-col items-center gap-4 pt-2 align-middle">
        <ImageProfile avatarUrl={git.avatarUrl} name={git.name} />
        <div className="hover:cursor-default">
          <HoverCard openDelay={100} closeDelay={300}>
            <HoverCardTrigger asChild>
              <a href="https://github.com/lewismorgan">
                <span className="text-2xl tracking-wide underline decoration-dashed underline-offset-8">
                  Software Engineer
                </span>
              </a>
            </HoverCardTrigger>
            <LewisHovercard
              avatarUrl={git.avatarUrl}
              bio={git.bio}
              privateRepositories={git.privateRepositories}
              url={git.url}
              username={git.username}
              repositories={git.repositories}
            />
          </HoverCard>
        </div>
        <Bullets />
      </div>
      <ContentSeperator />
      <section className="my-5 flex min-h-40 w-full flex-row flex-wrap justify-center gap-5 align-middle">
        <span className="flex w-full justify-center px-2 text-center align-middle font-sans font-light">
          You can find most projects that I have launched into the digital
          universe on GitHub. <br /> Below, you&apos;ll find some of the
          repositories that I have created.
        </span>
        <Suspense fallback={repoLoadText}>
          <RepositoryOverview count={REPOSITORY_DISPLAY_COUNT} />
          <div className="flex w-full justify-center px-2 text-center align-middle font-sans font-light">
            <span className="">
              Source code for these projects are available on GitHub, among many
              others! <br />
              Check out my profile{' '}
              <a
                href="https://github.com/lewismorgan"
                className="font-extralight underline underline-offset-2 hover:cursor-pointer"
              >
                @lewismorgan
              </a>{' '}
              to see more.
            </span>
          </div>
        </Suspense>
      </section>
    </main>
  )
}
