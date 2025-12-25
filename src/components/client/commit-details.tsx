'use client'
import { formatTimeRelativeToNow } from '~/lib/utils'

export const GitCardCommit = ({
  author,
  sha,
  message,
  date,
}: {
  author: string
  sha: string
  message: string
  date: number
}) => {
  // Using a client component for this because the date formatting is done client-side
  const formattedDate = formatTimeRelativeToNow(date)
  return (
    <>
      <div className="flex flex-row align-middle text-sm lg:text-sm">
        <span className="mr-1 font-semibold">{author}</span>
        <span className="truncate text-nowrap text-ellipsis hover:underline">
          {message}
        </span>
      </div>
      <span className="text-muted-foreground text-right align-text-bottom text-xs font-thin">
        {sha.slice(0, 7)} • {formattedDate}
      </span>
    </>
  )
}
