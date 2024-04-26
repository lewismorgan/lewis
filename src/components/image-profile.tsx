import Image from 'next/image'

import { LewisHovercard } from './git-hovercard'
import { HoverCard, HoverCardTrigger } from './ui/hover-card'

import { type SimpleGitUser } from '~/lib/git'

type Props = SimpleGitUser

export const ImageProfile = ({
  avatarUrl,
  name,
  url,
  username,
  bio,
  repositories,
  privateRepositories,
}: Props) => {
  return (
    <>
      <div className="block h-[128] w-[128] md:h-[256] md:w-[256] lg:h-[512] lg:w-[512]">
        <Image
          className="border-foreground overflow-clip rounded-full border-2 shadow-2xl"
          width={512}
          height={512}
          src={avatarUrl}
          alt={name}
        />
        <span className="text-muted-foreground relative -left-6 bottom-6 align-bottom font-mono text-xs tracking-tighter lg:left-20 lg:text-sm">
          fig. 1
        </span>
      </div>
      <div className="flex flex-row gap-1 align-middle hover:cursor-default">
        <HoverCard openDelay={100} closeDelay={300}>
          <HoverCardTrigger asChild>
            <a href="https://github.com/lewismorgan">
              <span className="text-2xl tracking-wide underline decoration-dashed underline-offset-8">
                Software Engineer
              </span>
            </a>
          </HoverCardTrigger>
          <LewisHovercard
            avatarUrl={avatarUrl}
            bio={bio}
            privateRepositories={privateRepositories}
            url={url}
            username={username}
            repositories={repositories}
          />
        </HoverCard>
      </div>
    </>
  )
}
