import type { NextRequest } from 'next/server'

import { getReadme } from '~/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ repo: string }> },
) {
  const { repo } = await params

  if (!repo) {
    return Response.json(
      { error: 'Repository name is required' },
      { status: 400 },
    )
  }

  const slowMode = request.nextUrl.searchParams.get('slowmode') === 'true'
  const readme = await getReadme(repo, slowMode)

  if (!readme) {
    return Response.json({ error: 'README not found' }, { status: 404 })
  }

  return Response.json({ content: readme })
}
