import { getRepositories } from '~/server'

export async function GET() {
  const data = await getRepositories(false)

  return Response.json({ ...data })
}
