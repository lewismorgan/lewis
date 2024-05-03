const Spiel = () => {
  return (
    <div className="space-y-2 hover:cursor-default">
      <div className="text-lg tracking-tight">
        Welcome to the digital space, domain, and realm of Lewis Morgan
      </div>
      <div>
        You may find a lot of{' '}
        <span className="relative">
          <span className="absolute -inset-0 block -skew-y-6 rounded-full bg-gradient-to-r from-transparent to-blue-400 hover:animate-pulse dark:to-red-800"></span>
          <span className="relative font-semibold hover:animate-pulse dark:text-white">
            glowsticks
          </span>
        </span>
        ,{' '}
        <span className="text-nowrap tracking-wide text-green-800 underline decoration-wavy decoration-1 underline-offset-2">
          space-lizards
        </span>
        , and lines of <span className="font-mono tracking-wider">code</span>{' '}
        lying around
      </div>
    </div>
  )
}

export const Hero = () => {
  return (
    <>
      <div className="flex h-fit flex-row place-self-center py-5 font-mono text-4xl tracking-tight hover:cursor-default md:text-5xl lg:text-7xl">
        <h1>Hello Internet</h1>
        <span className="inline-flex animate-pulse delay-1000">.</span>
      </div>
      <div className="px-2 text-center">
        <Spiel />
      </div>
    </>
  )
}
