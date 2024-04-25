// TODO: Display 3 github projects
// TODO: Scrolling-type feed with my 5 most recent commits

// TODO: Dark mode and light mode toggle

import Image from 'next/image'

const ImageProfile = () => {
  return (
    <>
      <div className="border-foreground block max-h-[512] max-w-[512] overflow-hidden rounded-full border-2 shadow-2xl ease-linear hover:animate-pulse">
        <Image
          className="relative"
          width={512}
          height={512}
          src="https://avatars.githubusercontent.com/u/1057112?v=4"
          alt="Lewis Morgan"
        />
      </div>
      <div className="flex flex-row gap-1">
        <span className="text-muted-foreground font-mono text-sm">fg.1</span>
        <a href="https://github.com/lewismorgan">
          <span className="text-2xl tracking-wide hover:underline hover:decoration-dashed">
            Software Engineer
          </span>
        </a>
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <main className="flex h-full w-full flex-col gap-1">
      <div className="flex h-fit flex-row place-self-center py-5 font-mono text-7xl tracking-tight hover:cursor-default">
        <h1 className="">Hello World</h1>
        <span className="animate-pulse delay-1000">.</span>
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
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
      className="h-7 w-7 text-orange-700 group-hover:-translate-x-1 group-hover:rotate-12 group-hover:scale-125"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      />
    </svg>
  )
}
