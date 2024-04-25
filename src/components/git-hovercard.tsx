// left-hand side show my avatar, then show lewismorgan
// show

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { HoverCardContent } from './ui/hover-card'

type Props = {
  url: string
  username: string
  bio: string
  repositories: number
  achievements: number
}

export const LewisHovercard = ({
  url,
  username,
  bio,
  repositories,
  achievements,
}: Props) => {
  const adjustedBio = bio.charAt(0).toLowerCase() + bio.slice(1)
  return (
    <HoverCardContent className="flex w-96 flex-col justify-between align-middle">
      <p className="p-1">
        <span className="inline-flex items-baseline self-center align-bottom">
          <Avatar className="h-6 w-6 self-center">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/1057112?v=4"
              alt={username}
            />
            <AvatarFallback>LM</AvatarFallback>
          </Avatar>
        </span>
        <a
          href={url}
          className="mx-1 font-mono text-sm underline underline-offset-2"
        >
          {username}
        </a>
        <span className="text-muted-foreground text-sm">
          is a {adjustedBio}
        </span>
      </p>
      <div className="mb-3 flex flex-row justify-center gap-2 text-sm">
        <div className="space-x-1">
          <span className="font-mono text-base">{repositories}</span>
          <span>Repositories</span>
          <span className="text-mono text-lg"> · </span>
          <span className="font-mono text-base">{achievements}</span>
          <span>Achievements</span>
        </div>
      </div>
    </HoverCardContent>
  )
}
