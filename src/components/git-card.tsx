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
  commitData: {
    author: string
    message: string
    date: string
    sha: string
  }
}

export const GitCard = ({
  name,
  description,
  languages,
  commits,
  commitData,
}: Props) => {
  // TODO: Change these into badges
  const langComponents = languages.map((language, index) => (
    <div key={language} className="text-xs text-muted-foreground md:text-sm">
      <span key={language}>{language}</span>
      {index < languages.length - 1 && (
        <span key={`${language}-separator`} className="text-card-foreground">
          {' · '}
        </span>
      )}
    </div>
  ))
  return (
    <Card className="w-fit p-1">
      <CardTitle className="p-1 font-mono font-thin tracking-tighter">
        {name}
      </CardTitle>
      <CardDescription className="w-full p-1 text-left align-middle">
        {description}
      </CardDescription>
      <CardContent className="flex w-full flex-col p-0">
        <div className="flex w-full flex-row justify-center gap-1">
          {langComponents}
        </div>
        <div className="flex w-full flex-col p-1">
          <div className="flex flex-row justify-between align-middle text-xs lg:text-sm">
            <span className="mr-1 font-bold">lewismorgan</span>
            <span className="w-[180px] truncate text-ellipsis text-nowrap hover:underline xl:w-[250px]">
              {commitData.message}
            </span>
          </div>
          <span className="text-right align-text-bottom text-xs">
            {commitData.sha.slice(0, 7)} ·{' '}
          </span>
        </div>
      </CardContent>
      <CardFooter className="block text-right text-sm text-muted-foreground">
        <span className="text-xs">{`${commits} commits are in this repository`}</span>
      </CardFooter>
    </Card>
  )
}
