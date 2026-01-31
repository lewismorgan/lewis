'use client'
import { Bot } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

import { type GitAuthor } from '~/lib/types'
import { formatTimeRelativeToNow } from '~/lib/utils'

export const GitCardCommit = ({
  authors,
  sha,
  message,
  date,
}: {
  authors: GitAuthor[]
  sha: string
  message: string
  date: number
}) => {
  // Using a client component for this because the date formatting is done client-side
  const formattedDate = formatTimeRelativeToNow(date)

  return (
    <>
      <div className="flex flex-row items-center gap-2 text-sm lg:text-sm">
        <div className="flex flex-row items-center gap-1">
          {authors.map((author, index) => (
            <div
              key={`${author.username}-${index}`}
              className="flex items-center gap-1"
            >
              {author.isBot && (
                <Bot
                  className="text-muted-foreground h-4 w-4"
                  aria-label="Bot contributor"
                />
              )}
              {!author.isBot && (
                <Avatar className="h-4 w-4">
                  <AvatarImage src={author.avatarUrl} alt={author.username} />
                  <AvatarFallback>
                    {author.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <a
                href={author.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                {author.username}
              </a>
              {index < authors.length - 1 && (
                <span className="text-muted-foreground">,</span>
              )}
            </div>
          ))}
        </div>
        <span className="truncate text-nowrap text-ellipsis hover:underline">
          {message.split('\n')[0]}
        </span>
      </div>
      <span className="text-muted-foreground text-right align-text-bottom text-xs font-thin">
        {sha.slice(0, 7)} • {formattedDate}
      </span>
    </>
  )
}
