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
      <div className="border-foreground block h-[256] max-h-[512] w-[256] max-w-[512] overflow-hidden rounded-full border-2 shadow-2xl ease-linear hover:animate-pulse lg:h-[512] lg:w-[512]">
        <Image
          className="relative"
          width={512}
          height={512}
          src={avatarUrl}
          alt={name}
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
