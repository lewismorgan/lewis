import { ExternalLink } from '../links'

import 'server-only'

type FooterProps = {
  commitSha?: string
}

export const Footer = ({ commitSha }: FooterProps) => {
  const safeSha = commitSha ?? 'PREVIEW'
  const commitUrl = `https://github.com/lewismorgan/lewis/commit/${safeSha}`
  const shaShort = safeSha.substring(0, 7)

  return (
    <footer className="flex w-full items-center justify-center">
      <div className="text-muted-foreground border-border fixed bottom-0 flex shrink flex-col justify-center gap-1 rounded-tl-sm rounded-tr-sm border-t border-r border-l p-2 align-middle text-xs backdrop-blur-xs md:flex-row">
        <div className="flex items-center justify-center">
          <span>
            Created by Lewis Morgan. Source code @{' '}
            <ExternalLink href="https://github.com/lewismorgan/lewis">
              GitHub
            </ExternalLink>
            .
          </span>
        </div>
        <div className="flex items-center justify-center">
          <span>
            Deployed from commit{' '}
            <ExternalLink href={commitUrl}>{shaShort}</ExternalLink>.
          </span>
        </div>
      </div>
    </footer>
  )
}
