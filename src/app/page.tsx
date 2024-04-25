// TODO: Show my avatar
// TODO: Background vector image thing
// TODO: Display 3 github projects
// TODO: Scrolling-type feed with my 5 most recent commits

// TODO: Sans-serif font / Mono font

// TODO: Dark mode and light mode toggle

const ImageProfile = () => {
  return (
    <>
      <div className="border-foreground block h-fit w-fit overflow-clip rounded-full border-2 shadow-2xl ease-linear hover:animate-pulse">
        <img
          src="https://avatars.githubusercontent.com/u/1057112?v=4"
          className="h-[260px] w-[260px] object-contain"
        />
      </div>
      <div className="flex flex-row gap-1">
        <span className="text-muted-foreground font-mono text-sm">fg.1</span>
        <a href="https://github.com/lewismorgan">
          <span className="text-2xl tracking-wide hover:underline">
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
      </div>
    </main>
  )
}
