import { request } from '@playwright/test'

export const VERCEL_BYPASS_STATE = 'test-results/.auth/vercel.json'

/**
 * When testing a protected Vercel deployment, trade the automation bypass
 * secret for a bypass cookie and save it as storage state. A cookie (rather
 * than global extraHTTPHeaders) keeps the secret off third-party requests
 * such as GitHub avatars.
 */
export default async function globalSetup(): Promise<void> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  if (!baseURL || !secret) return

  const context = await request.newContext({ baseURL })
  const response = await context.get('/', {
    headers: {
      'x-vercel-protection-bypass': secret,
      'x-vercel-set-bypass-cookie': 'true',
    },
  })
  if (!response.ok()) {
    throw new Error(
      `Vercel protection bypass failed for ${baseURL}: ${response.status()}`,
    )
  }
  await context.storageState({ path: VERCEL_BYPASS_STATE })
  await context.dispose()
}
