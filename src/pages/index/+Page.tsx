import { Button } from '@/components/ui/button.jsx'

import { Counter } from './Counter'

export default function Page() {
  return (
    <div className="flex w-full gap-4 h-full flex-col p-5 items-center align-middle justify-center">
      <Button className="">Hello World</Button>
      <p>Hello world this is some text</p>
      <Counter />
    </div>
  )
}
