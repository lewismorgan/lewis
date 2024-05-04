import { getRepositories } from '~/lib/git'

export async function GET() {
  const data = await getRepositories()

  return Response.json({ data })
}

export const revalidate = 60 * 60 // 1 hour
