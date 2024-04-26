import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from './ui/card'

type Props = {
  name: string
  description: string
  languages: string[]
  commits: number
}

export const GitCard = ({ name, description, languages, commits }: Props) => {
  const langComponents = languages.map((language, index) => (
    <>
      <span key={language} className="text-sm">
        {language}
      </span>
      {index < languages.length - 1 && (
        <span key={`${language}-separator`} className="text-sm">
          {' · '}
        </span>
      )}
    </>
  ))
  return (
    <Card className="w-fit px-1">
      <CardTitle className="font-mono font-thin tracking-tighter">
        {name}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
      <CardContent className="flex w-full flex-col p-0">
        <div className="flex w-full flex-row justify-center gap-1">
          {langComponents}
        </div>
        <div className="flex w-full flex-col p-1 hover:cursor-pointer hover:underline">
          <div className="flex flex-row justify-between align-middle text-sm">
            <span className="mr-1 font-bold">lewismorgan</span>
            <span className="w-[250] truncate text-ellipsis text-nowrap md:w-[375] lg:w-[500]">
              Fix build to force v14 or v15 node builds and stuff some extra
              long text
            </span>
          </div>
          <span className="text-right align-text-bottom text-xs">
            d7962c2 · 2 years ago
          </span>
        </div>
        <span className="flex justify-end text-xs">{`${commits} commits are in this repository`}</span>
      </CardContent>
      <CardFooter className="block text-right text-sm">
        Check it out on GitHub
      </CardFooter>
    </Card>
  )
}
