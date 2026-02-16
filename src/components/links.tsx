import { type PropsWithChildren } from 'react'

export const ExternalLink = ({
  children,
  href,
  ...rest
}: {
  href: string
} & PropsWithChildren &
  React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      href={href}
      target="_blank"
      className="hover:underline hover:underline-offset-4"
      {...rest}
    >
      {children}
    </a>
  )
}
