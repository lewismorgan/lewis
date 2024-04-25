import Image from 'next/image'

import { LewisHovercard } from './git-hovercard'
import { HoverCard, HoverCardTrigger } from './ui/hover-card'

// TODO: This will be retrieved for the GitHub API
const _gitLewis = {
  url: 'https://github.com/lewismorgan',
  username: 'lewismorgan',
  bio: 'Developer with a passion for Star Wars, Programming, Video Games and OSS. Actively working in the Space Industry to send us to the Moon, Mars, & Beyond.',
  repositories: 99,
  achievements: 3,
}

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
        <HoverCard openDelay={100} closeDelay={300}>
          <HoverCardTrigger asChild>
            <a href="https://github.com/lewismorgan">
              <span className="text-2xl tracking-wide underline decoration-dashed">
                Software Engineer
              </span>
            </a>
          </HoverCardTrigger>
          <LewisHovercard {..._gitLewis} />
        </HoverCard>
      </div>
    </>
  )
}
