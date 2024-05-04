import { getRepositories } from '~/server'

export async function GET() {
  const data = await getRepositories()

  return Response.json({ data })
}

export const revalidate = 60 * 60 // 1 hour
