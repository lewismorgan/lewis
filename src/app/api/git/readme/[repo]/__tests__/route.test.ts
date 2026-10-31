import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { getReadme } = vi.hoisted(() => ({ getReadme: vi.fn() }))

vi.mock('~/server/octokit', () => ({ getReadme }))

import { GET } from '~/app/api/git/readme/[repo]/route'

const callRoute = (repo: string, query = ''): Promise<Response> =>
  GET(new NextRequest(`http://localhost/api/git/readme/${repo}${query}`), {
    params: Promise.resolve({ repo }),
  })

describe('GET /api/git/readme/[repo]', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    getReadme.mockResolvedValue('# Hello')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('returns the README without delay by default', async () => {
    const response = await callRoute('lewis')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ content: '# Hello' })
    expect(getReadme).toHaveBeenCalledWith('lewis')
  })

  it('delays the README in slow mode', async () => {
    let settled = false
    const pending = callRoute('lewis', '?slowmode=true').then(response => {
      settled = true
      return response
    })

    await vi.advanceTimersByTimeAsync(1999)
    expect(settled).toBe(false)
    expect(getReadme).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    const response = await pending
    expect(settled).toBe(true)
    expect(response.status).toBe(200)
    expect(getReadme).toHaveBeenCalledWith('lewis')
  })

  it('returns 404 when the repository has no README', async () => {
    getReadme.mockResolvedValue(null)

    const response = await callRoute('no-readme')

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'README not found' })
  })
})
