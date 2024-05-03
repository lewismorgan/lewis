import { type PropsWithChildren } from 'react'

export const ExternalLink = ({
  children,
  href,
}: {
  href: string
} & PropsWithChildren) => {
  return (
    <a
      href={href}
      target="_blank"
      className="hover:underline hover:underline-offset-4"
    >
      {children}
    </a>
  )
}
