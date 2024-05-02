import { Badge } from './ui/badge'

import { type ProgrammingLanguage } from '~/lib/git'

function getLangColorVariants(language: ProgrammingLanguage) {
  switch (language) {
    case 'JavaScript':
      return 'bg-[#F7DF1E]'
    case 'TypeScript':
      return 'bg-[#3178C6]'
    case 'Python':
      return 'bg-[#3572A5]'
    case 'Java':
      return 'bg-[#b07219]'
    case 'CSS':
      return 'bg-[#563d7c]'
    case 'HTML':
      return 'bg-[#e34c26]'
    case 'Shell':
      return 'bg-[#89e051]'
    case 'C++':
      return 'bg-[#f34b7d]'
    default:
      return '' // Default color if language is not found
  }
}

export const LanguageBadges = ({
  languages,
}: {
  languages: ProgrammingLanguage[]
}) => {
  const langComponents = languages
    .map(language => [language.toString(), getLangColorVariants(language)])
    .map((language, index) => {
      const [name, color] = language
      return (
        <Badge key={`${name}-${index}`} className={`text-white ${color}`}>
          {name}
        </Badge>
      )
    })
  return <>{langComponents}</>
}
