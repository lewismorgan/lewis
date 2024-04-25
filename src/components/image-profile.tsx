import Image from 'next/image'

export const ImageProfile = () => {
  return (
    <>
      <div className="border-foreground block h-[256] max-h-[512] w-[256] max-w-[512] overflow-hidden rounded-full border-2 shadow-2xl ease-linear hover:animate-pulse lg:h-[512] lg:w-[512]">
        <Image
          className="relative"
          width={512}
          height={512}
          src="https://avatars.githubusercontent.com/u/1057112?v=4"
          alt="Lewis Morgan"
        />
      </div>
      <div className="flex flex-row gap-1 hover:cursor-default">
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
