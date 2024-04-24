import logoUrl from '../../assets/logo.svg'

// Default <head> (can be overridden by pages)

export default function HeadDefault() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="The site for Lewis" />
      <link rel="icon" href={logoUrl} />
    </>
  )
}
