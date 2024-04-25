import { ImageProfile } from '~/components/image-profile'
import { GradCapPath, RocketPath } from '~/components/svg-paths'

const AcademicCap = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-7 w-7 text-green-700"
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
      className="h-7 w-7 text-orange-700 group-hover:-translate-x-1 group-hover:rotate-[25deg] group-hover:scale-125"
    >
      <RocketPath />
    </svg>
  )
}

const Spiel = () => {
  return (
    <>
      <span className="text-center">
        The self-proclaimed digital space, domain, and realm of Lewis Morgan.
      </span>
      <span className="text-center hover:cursor-default">
        There may be a lot of{' '}
        <span className="relative">
          <span className="absolute -inset-0 block -skew-y-6 rounded-full bg-gradient-to-r from-transparent to-red-800"></span>
          <span className="relative font-medium">glowsticks</span>
        </span>
        ,{' '}
        <span className="tracking-wide text-green-800 underline decoration-wavy decoration-1 underline-offset-2">
          space lizards
        </span>
        , and <span className="font-mono tracking-wider">code</span> lying
        around.
      </span>
    </>
  )
}

// TODO: Display 3 github projects
// TODO: Scrolling-type feed with my 5 most recent commits
// TODO: Dark mode and light mode toggle

export default function HomePage() {
  return (
    <main className="flex h-full w-full flex-col gap-1">
      <div className="flex h-fit flex-row place-self-center py-5 font-mono text-6xl tracking-tight hover:cursor-default">
        <h1 className="">Hello Internet</h1>
        <span className="animate-pulse delay-1000">.</span>
      </div>
      <div className="flex w-full flex-col justify-center justify-items-center p-2 align-middle">
        <Spiel />
      </div>
      <div className="flex w-full flex-col items-center pt-10 align-middle">
        <ImageProfile />
        <div className="group relative flex w-fit flex-row gap-1 pt-5 hover:animate-pulse hover:cursor-default">
          <AcademicCap />
          <span className="text-lg">
            Alumni of the University of South Florida
          </span>
        </div>
        <div className="group relative flex w-fit flex-row gap-1 hover:animate-pulse hover:cursor-default">
          <RocketLaunch />
          <span className="text-lg">
            Sending humanity back to the Moon, Mars, and Beyond
          </span>
        </div>
      </div>
    </main>
  )
}
