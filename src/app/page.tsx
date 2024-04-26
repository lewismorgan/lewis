import { LewisHovercard } from '~/components/git-hovercard'
import { ImageProfile } from '~/components/image-profile'
import { GradCapPath, RocketPath } from '~/components/svg-paths'
import { HoverCard, HoverCardTrigger } from '~/components/ui/hover-card'
import { type SimpleGitUser } from '~/lib/git'
import { getUser } from '~/server/git'

const AcademicCap = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-7 w-7 text-green-700 group-hover:translate-x-1 group-hover:rotate-[25deg] group-hover:scale-125"
    >
      <GradCapPath />
    </svg>
  )
}

const RocketLaunch = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-7 w-7 text-orange-700 group-hover:translate-x-1 group-hover:rotate-[25deg] group-hover:scale-125"
    >
      <RocketPath />
    </svg>
  )
}

const Spiel = () => {
  return (
    <span className="hover:cursor-default">
      The digital space, domain, and realm of Lewis Morgan. There may be a lot
      of{' '}
      <span className="relative">
        <span className="absolute -inset-0 block -skew-y-6 rounded-full bg-gradient-to-r from-transparent to-red-800 hover:animate-pulse"></span>
        <span className="relative font-semibold hover:animate-pulse">
          glowsticks
        </span>
      </span>
      ,{' '}
      <span className="text-nowrap tracking-wide text-green-800 underline decoration-wavy decoration-1 underline-offset-2">
        space-lizards
      </span>
      , and <span className="font-mono tracking-wider">code</span> lying around.
    </span>
  )
}

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
// TODO: Display 3 github projects
// TODO: Scrolling-type feed with my 5 most recent commits
// TODO: Dark mode and light mode toggle

export default async function HomePage() {
  const data = await getUser()

  const userData: SimpleGitUser = {
    avatarUrl: data.avatar_url,
    name: data.name ?? '',
    url: data.html_url ?? '',
    username: data.login,
    bio: data.bio ?? '',
    repositories: data.public_repos,
    privateRepositories: data.total_private_repos ?? 0,
  }

  return (
    <main className="flex h-full w-full flex-col gap-1 px-1">
      <div className="flex h-fit flex-row place-self-center py-5 font-mono text-4xl tracking-tight hover:cursor-default md:text-5xl lg:text-7xl">
        <h1>Hello Internet</h1>
        <span className="inline-flex animate-pulse delay-1000">.</span>
      </div>
      <div className="px-2 text-center">
        <Spiel />
      </div>
      <div className="flex w-full flex-col items-center gap-1 pt-2 align-middle">
        <ImageProfile avatarUrl={userData.avatarUrl} name={userData.name} />
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
              avatarUrl={userData.avatarUrl}
              bio={userData.bio}
              privateRepositories={userData.privateRepositories}
              url={userData.url}
              username={userData.username}
              repositories={userData.repositories}
            />
          </HoverCard>
        </div>
        <Bullets />
      </div>
    </main>
  )
}
