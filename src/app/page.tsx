import { GitCard } from '~/components/git-card'
import { LewisHovercard } from '~/components/git-hovercard'
import { Hero } from '~/components/hero'
import { AcademicCap, RocketLaunch } from '~/components/icons'
import { ImageProfile } from '~/components/image-profile'
import { HoverCard, HoverCardTrigger } from '~/components/ui/hover-card'
import { getMyGit, getRepositories, getRepositoryInformation } from '~/lib/git'

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

export default async function HomePage() {
  // TODO: Hydrate everything

  const git = await getMyGit()
  const repositories = await getRepositories()

  const myReposAndCommits = await Promise.all(
    repositories.flatMap(async repo => await getRepositoryInformation(repo)),
  )

  const filteredRepos = myReposAndCommits.filter(repo => !repo.fork).slice(0, 5)
  return (
    <main className="flex w-full flex-col gap-1 px-1">
      <Hero />
      <div className="flex w-full flex-col items-center gap-1 pt-2 align-middle">
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
      <div className="my-5 flex w-full flex-row flex-wrap justify-center gap-5 align-middle">
        {filteredRepos.map((repo, index) => (
          <GitCard key={index} {...repo} />
        ))}
      </div>
    </main>
  )
}
