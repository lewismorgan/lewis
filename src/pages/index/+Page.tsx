import { Button } from '@/components/ui/button.jsx'

import { Counter } from './Counter'

// TODO: Show my avatar
// TODO: Ensure page looks good at all display sizes
// TODO: Background vector image thing
// TODO: Display 3 github projects
// TODO: Scrolling-type feed with my 5 most recent commits

// TODO: Sans-serif font / Mono font

// TODO: Dark mode and light mode toggle

const ImageProfile = () => {
  return (
    <>
      <div className="block rounded-full overflow-clip w-fit h-fit shadow-2xl border-foreground border-2 hover:animate-pulse ease-linear">
        <img
          src="https://avatars.githubusercontent.com/u/1057112?v=4"
          className="w-[260px] h-[260px] object-contain"
        />
      </div>
      <div className="flex flex-row gap-1">
        <span className="text-sm text-muted-foreground font-mono">fg.1</span>
        <a href="https://github.com/lewismorgan">
          <span className="text-2xl tracking-wide hover:underline">
            Software Engineer
          </span>
        </a>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <main className="flex flex-col w-full h-full gap-1">
      <div className="flex flex-row h-fit place-self-center py-5 text-7xl tracking-tight font-mono hover:cursor-default">
        <h1 className="">Hello World</h1>
        <span className="animate-pulse delay-1000">.</span>
      </div>
      <div className="flex flex-col w-full items-center align-middle pt-10">
        <ImageProfile />
      </div>
    </main>
  )
}
