import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { HoverCardContent } from './ui/hover-card'

type Props = {
  url: string
  avatarUrl: string
  username: string
  bio: string
  repositories: number
  privateRepositories: number
}

export const LewisHovercard = ({
  url,
  avatarUrl,
  username,
  bio,
  repositories,
  privateRepositories,
}: Props) => {
  const adjustedBio = bio.charAt(0).toLowerCase() + bio.slice(1)
  return (
    <HoverCardContent className="flex w-96 flex-col justify-between align-middle">
      <p className="p-1">
        <span className="inline-flex items-baseline self-center align-bottom">
          <Avatar className="h-6 w-6 self-center">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>LM</AvatarFallback>
          </Avatar>
        </span>
        <a
          href={url}
          target="_blank"
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
          <span>Public Repos</span>
          <span className="text-mono text-lg"> · </span>
          <span className="font-mono text-base">{privateRepositories}</span>
          <span>Private Repos</span>
        </div>
      </div>
    </HoverCardContent>
  )
}
