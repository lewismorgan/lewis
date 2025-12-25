import { GradCapPath, RocketPath } from './svg-paths'

export const AcademicCap = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-7 w-7 text-green-700 group-hover:translate-x-1 group-hover:scale-125 group-hover:rotate-25"
    >
      <GradCapPath />
    </svg>
  )
}

export const RocketLaunch = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-7 w-7 text-orange-700 group-hover:translate-x-1 group-hover:scale-125 group-hover:rotate-25"
    >
      <RocketPath />
    </svg>
  )
}
