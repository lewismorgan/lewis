import { ExternalLink } from '../links'

import 'server-only'

type Props = {
  commitSha?: string
}

export const Footer = ({ commitSha }: Props) => {
  const safeSha = commitSha ?? 'PREVIEW'
  const commitUrl = `https://github.com/lewismorgan/lewis/commit/${safeSha}`
  const shaShort = safeSha.substring(0, 7)

  return (
    <footer className="flex shrink flex-col items-center justify-center">
      <div className="text-muted-foreground border-border fixed bottom-0 flex justify-center gap-2 rounded-tl-sm rounded-tr-sm border-t border-r border-l p-2 align-middle text-xs backdrop-blur-xs">
        <span>
          Created by Lewis Morgan. Source @{' '}
          <ExternalLink href="https://github.com/lewismorgan/lewis">
            GitHub
          </ExternalLink>
          . Deployed from commit{' '}
          <ExternalLink href={commitUrl}>{shaShort}</ExternalLink>.
        </span>
      </div>
    </footer>
  )
}
