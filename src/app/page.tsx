import { Hero } from '~/components/client/hero'
import { SlowModeContainer } from '~/components/client/repo-container'
import { LewisHovercard } from '~/components/git-hovercard'
import { RepositoryOverview } from '~/components/server/repo-overview'
import { HoverCard, HoverCardTrigger } from '~/components/ui/hover-card'
import { Separator } from '~/components/ui/separator'
import { AcademicCap, RocketLaunch } from '~/components/utils/icons'
import { getMyGit } from '~/server'

const REPOSITORY_DISPLAY_COUNT = 5

const Bullets = () => {
  return (
    <div className="flex flex-col gap-3 leading-relaxed tracking-tight md:text-lg">
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
          <span className="tracking-widest text-nowrap">
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

const ContentSeperator = () => (
  <Separator className="mx-auto my-8 w-[95%] md:my-12" />
)

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const git = await getMyGit()
  const slowmode = (await searchParams).slowmode === 'true'

  return (
    <main className="flex w-full flex-col gap-4 px-4 md:gap-6 md:px-6">
      <Hero profileImage={git.avatarUrl} name={git.username} />
      <div className="flex w-full flex-col items-center gap-6 pt-2 align-middle md:gap-8 md:pt-3">
        <div className="hover:cursor-default">
          <HoverCard openDelay={100} closeDelay={300}>
            <HoverCardTrigger asChild>
              <a href="https://github.com/lewismorgan" target="_blank">
                <span className="text-2xl leading-relaxed tracking-wide underline decoration-dashed underline-offset-8 md:text-3xl">
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
      <section className="mb-8 flex min-h-40 w-full flex-row flex-wrap justify-center gap-5 align-middle md:mb-12">
        <span className="flex w-full justify-center px-2 text-center align-middle font-sans leading-relaxed font-light">
          You can find most of the projects that I have launched into the
          digital universe on GitHub. These are some of my favorites! <br />
          <br />
          Use the Slow Mode toggle to see what happens on a slower network
          connection.
        </span>
        <div className="flex flex-col space-y-4">
          <SlowModeContainer>
            <RepositoryOverview
              count={REPOSITORY_DISPLAY_COUNT}
              slowMode={slowmode}
            />
          </SlowModeContainer>
          <div className="flex w-full justify-center px-2 text-center align-middle font-sans leading-relaxed font-light">
            <span className="">
              Visit my GitHub profile{' '}
              <a
                href="https://github.com/lewismorgan"
                className="font-extralight underline underline-offset-2 hover:cursor-pointer"
              >
                @lewismorgan
              </a>{' '}
              to check out the source code for all these projects and more.
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}

export const revalidate = 3600 // revalidate at most every hour
