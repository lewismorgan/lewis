'use client'
import { Bot } from 'lucide-react'

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

  // Remove duplicate authors based on username
  const uniqueAuthors = authors.filter(
    (author, index, self) =>
      index === self.findIndex(a => a.username === author.username),
  )

  // Separate bots and humans
  const bots = uniqueAuthors.filter(author => author.isBot)
  const humans = uniqueAuthors.filter(author => !author.isBot)

  // Show bot icon if there's at least one bot
  const hasBots = bots.length > 0

  return (
    <>
      <div className="flex flex-row items-center gap-2 text-sm lg:text-sm">
        <div className="flex flex-row items-center gap-1">
          {/* Show single bot icon if any bots are present */}
          {hasBots && (
            <Bot
              className="text-muted-foreground h-4 w-4"
              aria-label="Bot contributor"
            />
          )}
          {/* Show + character and human author names only if multiple authors */}
          {humans.map((human, index) => (
            <span
              key={`human-${human.username}-${index}`}
              className="flex items-center gap-1"
            >
              {(humans.length > 1 || hasBots) && (
                <span className="text-muted-foreground">+</span>
              )}
              <a
                href={human.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                {human.username}
              </a>
            </span>
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
